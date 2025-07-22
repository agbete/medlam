const express = require('express');
const { getDatabase } = require('../models/database');

const router = express.Router();
const db = getDatabase();

// GET /api/search - Recherche dans les versets
router.get('/', async (req, res) => {
  try {
    const { 
      q: query, 
      book, 
      testament, 
      limit = 50, 
      offset = 0 
    } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }
    
    let sql = `
      SELECT 
        v.id,
        v.verse_number,
        v.text,
        c.chapter_number,
        b.name as book_name,
        b.abbreviation,
        b.testament,
        snippet(verses_fts, 4, '<mark>', '</mark>', '...', 32) as highlighted_text
      FROM verses_fts
      JOIN verses v ON verses_fts.verse_id = v.id
      JOIN chapters c ON v.chapter_id = c.id
      JOIN books b ON c.book_id = b.id
      WHERE verses_fts MATCH ?
    `;
    
    let params = [query];
    
    // Filtrer par livre si spécifié
    if (book) {
      sql += ' AND (b.name LIKE ? OR b.abbreviation LIKE ?)';
      params.push(`%${book}%`, `%${book}%`);
    }
    
    // Filtrer par testament si spécifié
    if (testament && ['Ancien', 'Nouveau'].includes(testament)) {
      sql += ' AND b.testament = ?';
      params.push(testament);
    }
    
    sql += ' ORDER BY bm25(verses_fts) LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const results = await db.all(sql, params);
    
    // Compter le nombre total de résultats pour la pagination
    let countSql = `
      SELECT COUNT(*) as total
      FROM verses_fts
      JOIN verses v ON verses_fts.verse_id = v.id
      JOIN chapters c ON v.chapter_id = c.id
      JOIN books b ON c.book_id = b.id
      WHERE verses_fts MATCH ?
    `;
    
    let countParams = [query];
    
    if (book) {
      countSql += ' AND (b.name LIKE ? OR b.abbreviation LIKE ?)';
      countParams.push(`%${book}%`, `%${book}%`);
    }
    
    if (testament && ['Ancien', 'Nouveau'].includes(testament)) {
      countSql += ' AND b.testament = ?';
      countParams.push(testament);
    }
    
    const countResult = await db.get(countSql, countParams);
    
    res.json({
      success: true,
      data: {
        results,
        pagination: {
          total: countResult.total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + results.length < countResult.total
        },
        query: {
          text: query,
          book,
          testament
        }
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche'
    });
  }
});

// GET /api/search/suggestions - Suggestions de recherche
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Rechercher des mots similaires dans les versets
    const suggestions = await db.all(
      `SELECT DISTINCT 
         substr(text, 1, 100) as suggestion,
         b.name as book_name,
         c.chapter_number,
         v.verse_number
       FROM verses v
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE v.text LIKE ?
       ORDER BY LENGTH(v.text)
       LIMIT 10`,
      [`%${query}%`]
    );
    
    res.json({
      success: true,
      data: suggestions
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des suggestions'
    });
  }
});

// GET /api/search/popular - Termes de recherche populaires
router.get('/popular', async (req, res) => {
  try {
    // Pour l'instant, retourner des termes prédéfinis
    // Dans une vraie application, on pourrait tracker les recherches
    const popularTerms = [
      'amour',
      'paix',
      'joie',
      'espoir',
      'foi',
      'grâce',
      'pardon',
      'salut',
      'prière',
      'sagesse'
    ];
    
    res.json({
      success: true,
      data: popularTerms
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des termes populaires:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des termes populaires'
    });
  }
});

module.exports = router;

