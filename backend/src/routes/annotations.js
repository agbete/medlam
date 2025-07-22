const express = require('express');
const { getDatabase } = require('../models/database');

const router = express.Router();
const db = getDatabase();

// Middleware pour obtenir l'identifiant de session utilisateur
const getUserSession = (req, res, next) => {
  // Pour l'instant, utiliser l'IP comme identifiant de session
  // Dans une vraie application, on utiliserait JWT ou sessions
  req.userSession = req.ip || 'anonymous';
  next();
};

router.use(getUserSession);

// GET /api/annotations - Récupérer toutes les annotations de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const { userSession } = req;
    const { type, limit = 50, offset = 0 } = req.query;
    
    let sql = `
      SELECT 
        a.*,
        v.verse_number,
        v.text as verse_text,
        c.chapter_number,
        b.name as book_name,
        b.abbreviation
      FROM annotations a
      JOIN verses v ON a.verse_id = v.id
      JOIN chapters c ON v.chapter_id = c.id
      JOIN books b ON c.book_id = b.id
      WHERE a.user_session = ?
    `;
    
    let params = [userSession];
    
    // Filtrer par type si spécifié
    if (type === 'favorites') {
      sql += ' AND a.is_favorite = 1';
    } else if (type === 'notes') {
      sql += ' AND a.note IS NOT NULL AND a.note != ""';
    }
    
    sql += ' ORDER BY a.updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const annotations = await db.all(sql, params);
    
    // Compter le total
    let countSql = 'SELECT COUNT(*) as total FROM annotations WHERE user_session = ?';
    let countParams = [userSession];
    
    if (type === 'favorites') {
      countSql += ' AND is_favorite = 1';
    } else if (type === 'notes') {
      countSql += ' AND note IS NOT NULL AND note != ""';
    }
    
    const countResult = await db.get(countSql, countParams);
    
    res.json({
      success: true,
      data: {
        annotations,
        pagination: {
          total: countResult.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + annotations.length < countResult.total
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des annotations:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des annotations'
    });
  }
});

// POST /api/annotations - Créer une nouvelle annotation
router.post('/', async (req, res) => {
  try {
    const { userSession } = req;
    const { verse_id, note, color = '#fbbf24', is_favorite = false } = req.body;
    
    if (!verse_id) {
      return res.status(400).json({
        success: false,
        error: 'L\'ID du verset est requis'
      });
    }
    
    // Vérifier que le verset existe
    const verse = await db.get('SELECT id FROM verses WHERE id = ?', [verse_id]);
    if (!verse) {
      return res.status(404).json({
        success: false,
        error: 'Verset non trouvé'
      });
    }
    
    // Vérifier si une annotation existe déjà pour ce verset et cet utilisateur
    const existingAnnotation = await db.get(
      'SELECT id FROM annotations WHERE verse_id = ? AND user_session = ?',
      [verse_id, userSession]
    );
    
    if (existingAnnotation) {
      return res.status(409).json({
        success: false,
        error: 'Une annotation existe déjà pour ce verset'
      });
    }
    
    // Créer la nouvelle annotation
    const result = await db.run(
      `INSERT INTO annotations (verse_id, user_session, note, color, is_favorite)
       VALUES (?, ?, ?, ?, ?)`,
      [verse_id, userSession, note || '', color, is_favorite ? 1 : 0]
    );
    
    // Récupérer l'annotation créée avec les détails du verset
    const newAnnotation = await db.get(
      `SELECT 
         a.*,
         v.verse_number,
         v.text as verse_text,
         c.chapter_number,
         b.name as book_name,
         b.abbreviation
       FROM annotations a
       JOIN verses v ON a.verse_id = v.id
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE a.id = ?`,
      [result.id]
    );
    
    res.status(201).json({
      success: true,
      data: newAnnotation
    });
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'annotation'
    });
  }
});

// PUT /api/annotations/:id - Mettre à jour une annotation
router.put('/:id', async (req, res) => {
  try {
    const { userSession } = req;
    const { id } = req.params;
    const { note, color, is_favorite } = req.body;
    
    // Vérifier que l'annotation existe et appartient à l'utilisateur
    const annotation = await db.get(
      'SELECT id FROM annotations WHERE id = ? AND user_session = ?',
      [id, userSession]
    );
    
    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Annotation non trouvée'
      });
    }
    
    // Construire la requête de mise à jour dynamiquement
    const updates = [];
    const params = [];
    
    if (note !== undefined) {
      updates.push('note = ?');
      params.push(note);
    }
    
    if (color !== undefined) {
      updates.push('color = ?');
      params.push(color);
    }
    
    if (is_favorite !== undefined) {
      updates.push('is_favorite = ?');
      params.push(is_favorite ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune donnée à mettre à jour'
      });
    }
    
    params.push(id);
    
    await db.run(
      `UPDATE annotations SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    // Récupérer l'annotation mise à jour
    const updatedAnnotation = await db.get(
      `SELECT 
         a.*,
         v.verse_number,
         v.text as verse_text,
         c.chapter_number,
         b.name as book_name,
         b.abbreviation
       FROM annotations a
       JOIN verses v ON a.verse_id = v.id
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE a.id = ?`,
      [id]
    );
    
    res.json({
      success: true,
      data: updatedAnnotation
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'annotation'
    });
  }
});

// DELETE /api/annotations/:id - Supprimer une annotation
router.delete('/:id', async (req, res) => {
  try {
    const { userSession } = req;
    const { id } = req.params;
    
    // Vérifier que l'annotation existe et appartient à l'utilisateur
    const annotation = await db.get(
      'SELECT id FROM annotations WHERE id = ? AND user_session = ?',
      [id, userSession]
    );
    
    if (!annotation) {
      return res.status(404).json({
        success: false,
        error: 'Annotation non trouvée'
      });
    }
    
    await db.run('DELETE FROM annotations WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Annotation supprimée avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'annotation'
    });
  }
});

// GET /api/annotations/verse/:verseId - Récupérer l'annotation d'un verset spécifique
router.get('/verse/:verseId', async (req, res) => {
  try {
    const { userSession } = req;
    const { verseId } = req.params;
    
    const annotation = await db.get(
      `SELECT 
         a.*,
         v.verse_number,
         v.text as verse_text,
         c.chapter_number,
         b.name as book_name,
         b.abbreviation
       FROM annotations a
       JOIN verses v ON a.verse_id = v.id
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE a.verse_id = ? AND a.user_session = ?`,
      [verseId, userSession]
    );
    
    res.json({
      success: true,
      data: annotation || null
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'annotation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'annotation'
    });
  }
});

module.exports = router;

