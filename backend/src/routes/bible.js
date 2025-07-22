const express = require('express');
const { getDatabase } = require('../models/database');

const router = express.Router();
const db = getDatabase();

// GET /api/bible/books - Récupérer tous les livres
router.get('/books', async (req, res) => {
  try {
    const { testament } = req.query;
    
    let sql = 'SELECT * FROM books';
    let params = [];
    
    if (testament && ['Ancien', 'Nouveau'].includes(testament)) {
      sql += ' WHERE testament = ?';
      params.push(testament);
    }
    
    sql += ' ORDER BY book_order';
    
    const books = await db.all(sql, params);
    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des livres'
    });
  }
});

// GET /api/bible/books/:id - Récupérer un livre spécifique
router.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await db.get(
      'SELECT * FROM books WHERE id = ?',
      [id]
    );
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé'
      });
    }
    
    // Récupérer aussi les chapitres
    const chapters = await db.all(
      'SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number',
      [id]
    );
    
    res.json({
      success: true,
      data: {
        ...book,
        chapters
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du livre'
    });
  }
});

// GET /api/bible/books/:bookId/chapters/:chapterNumber - Récupérer un chapitre avec ses versets
router.get('/books/:bookId/chapters/:chapterNumber', async (req, res) => {
  try {
    const { bookId, chapterNumber } = req.params;
    
    // Vérifier que le livre existe
    const book = await db.get('SELECT * FROM books WHERE id = ?', [bookId]);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Livre non trouvé'
      });
    }
    
    // Récupérer le chapitre
    const chapter = await db.get(
      'SELECT * FROM chapters WHERE book_id = ? AND chapter_number = ?',
      [bookId, chapterNumber]
    );
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        error: 'Chapitre non trouvé'
      });
    }
    
    // Récupérer les versets
    const verses = await db.all(
      `SELECT v.*, a.note, a.color, a.is_favorite
       FROM verses v
       LEFT JOIN annotations a ON v.id = a.verse_id
       WHERE v.chapter_id = ?
       ORDER BY v.verse_number`,
      [chapter.id]
    );
    
    res.json({
      success: true,
      data: {
        book,
        chapter,
        verses
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du chapitre:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du chapitre'
    });
  }
});

// GET /api/bible/verses/:id - Récupérer un verset spécifique
router.get('/verses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const verse = await db.get(
      `SELECT v.*, c.chapter_number, b.name as book_name, b.abbreviation
       FROM verses v
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       WHERE v.id = ?`,
      [id]
    );
    
    if (!verse) {
      return res.status(404).json({
        success: false,
        error: 'Verset non trouvé'
      });
    }
    
    res.json({
      success: true,
      data: verse
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du verset:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du verset'
    });
  }
});

// GET /api/bible/random - Récupérer un verset aléatoire
router.get('/random', async (req, res) => {
  try {
    const verse = await db.get(
      `SELECT v.*, c.chapter_number, b.name as book_name, b.abbreviation
       FROM verses v
       JOIN chapters c ON v.chapter_id = c.id
       JOIN books b ON c.book_id = b.id
       ORDER BY RANDOM()
       LIMIT 1`
    );
    
    res.json({
      success: true,
      data: verse
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du verset aléatoire:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du verset aléatoire'
    });
  }
});

// GET /api/bible/stats - Statistiques de la Bible
router.get('/stats', async (req, res) => {
  try {
    const stats = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM books'),
      db.get('SELECT COUNT(*) as count FROM chapters'),
      db.get('SELECT COUNT(*) as count FROM verses'),
      db.get('SELECT COUNT(*) as count FROM annotations')
    ]);
    
    res.json({
      success: true,
      data: {
        books: stats[0].count,
        chapters: stats[1].count,
        verses: stats[2].count,
        annotations: stats[3].count
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router;

