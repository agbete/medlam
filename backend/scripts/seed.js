const { getDatabase } = require('../src/models/database');

// Données de base pour la Bible (version française simplifiée)
const bibleData = {
  books: [
    // Ancien Testament
    { name: 'Genèse', abbreviation: 'Gn', testament: 'Ancien', book_order: 1, chapter_count: 50 },
    { name: 'Exode', abbreviation: 'Ex', testament: 'Ancien', book_order: 2, chapter_count: 40 },
    { name: 'Lévitique', abbreviation: 'Lv', testament: 'Ancien', book_order: 3, chapter_count: 27 },
    { name: 'Nombres', abbreviation: 'Nb', testament: 'Ancien', book_order: 4, chapter_count: 36 },
    { name: 'Deutéronome', abbreviation: 'Dt', testament: 'Ancien', book_order: 5, chapter_count: 34 },
    { name: 'Josué', abbreviation: 'Jos', testament: 'Ancien', book_order: 6, chapter_count: 24 },
    { name: 'Juges', abbreviation: 'Jg', testament: 'Ancien', book_order: 7, chapter_count: 21 },
    { name: 'Ruth', abbreviation: 'Rt', testament: 'Ancien', book_order: 8, chapter_count: 4 },
    { name: '1 Samuel', abbreviation: '1S', testament: 'Ancien', book_order: 9, chapter_count: 31 },
    { name: '2 Samuel', abbreviation: '2S', testament: 'Ancien', book_order: 10, chapter_count: 24 },
    { name: '1 Rois', abbreviation: '1R', testament: 'Ancien', book_order: 11, chapter_count: 22 },
    { name: '2 Rois', abbreviation: '2R', testament: 'Ancien', book_order: 12, chapter_count: 25 },
    { name: 'Psaumes', abbreviation: 'Ps', testament: 'Ancien', book_order: 19, chapter_count: 150 },
    { name: 'Proverbes', abbreviation: 'Pr', testament: 'Ancien', book_order: 20, chapter_count: 31 },
    { name: 'Ecclésiaste', abbreviation: 'Ec', testament: 'Ancien', book_order: 21, chapter_count: 12 },
    { name: 'Esaïe', abbreviation: 'Es', testament: 'Ancien', book_order: 23, chapter_count: 66 },
    { name: 'Jérémie', abbreviation: 'Jr', testament: 'Ancien', book_order: 24, chapter_count: 52 },
    
    // Nouveau Testament
    { name: 'Matthieu', abbreviation: 'Mt', testament: 'Nouveau', book_order: 40, chapter_count: 28 },
    { name: 'Marc', abbreviation: 'Mc', testament: 'Nouveau', book_order: 41, chapter_count: 16 },
    { name: 'Luc', abbreviation: 'Lc', testament: 'Nouveau', book_order: 42, chapter_count: 24 },
    { name: 'Jean', abbreviation: 'Jn', testament: 'Nouveau', book_order: 43, chapter_count: 21 },
    { name: 'Actes', abbreviation: 'Ac', testament: 'Nouveau', book_order: 44, chapter_count: 28 },
    { name: 'Romains', abbreviation: 'Rm', testament: 'Nouveau', book_order: 45, chapter_count: 16 },
    { name: '1 Corinthiens', abbreviation: '1Co', testament: 'Nouveau', book_order: 46, chapter_count: 16 },
    { name: '2 Corinthiens', abbreviation: '2Co', testament: 'Nouveau', book_order: 47, chapter_count: 13 },
    { name: 'Galates', abbreviation: 'Ga', testament: 'Nouveau', book_order: 48, chapter_count: 6 },
    { name: 'Éphésiens', abbreviation: 'Ep', testament: 'Nouveau', book_order: 49, chapter_count: 6 },
    { name: 'Philippiens', abbreviation: 'Ph', testament: 'Nouveau', book_order: 50, chapter_count: 4 },
    { name: 'Colossiens', abbreviation: 'Col', testament: 'Nouveau', book_order: 51, chapter_count: 4 },
    { name: '1 Thessaloniciens', abbreviation: '1Th', testament: 'Nouveau', book_order: 52, chapter_count: 5 },
    { name: '2 Thessaloniciens', abbreviation: '2Th', testament: 'Nouveau', book_order: 53, chapter_count: 3 },
    { name: '1 Timothée', abbreviation: '1Tm', testament: 'Nouveau', book_order: 54, chapter_count: 6 },
    { name: '2 Timothée', abbreviation: '2Tm', testament: 'Nouveau', book_order: 55, chapter_count: 4 },
    { name: 'Tite', abbreviation: 'Tt', testament: 'Nouveau', book_order: 56, chapter_count: 3 },
    { name: 'Hébreux', abbreviation: 'He', testament: 'Nouveau', book_order: 58, chapter_count: 13 },
    { name: 'Jacques', abbreviation: 'Jc', testament: 'Nouveau', book_order: 59, chapter_count: 5 },
    { name: '1 Pierre', abbreviation: '1P', testament: 'Nouveau', book_order: 60, chapter_count: 5 },
    { name: '2 Pierre', abbreviation: '2P', testament: 'Nouveau', book_order: 61, chapter_count: 3 },
    { name: '1 Jean', abbreviation: '1Jn', testament: 'Nouveau', book_order: 62, chapter_count: 5 },
    { name: '2 Jean', abbreviation: '2Jn', testament: 'Nouveau', book_order: 63, chapter_count: 1 },
    { name: '3 Jean', abbreviation: '3Jn', testament: 'Nouveau', book_order: 64, chapter_count: 1 },
    { name: 'Jude', abbreviation: 'Jd', testament: 'Nouveau', book_order: 65, chapter_count: 1 },
    { name: 'Apocalypse', abbreviation: 'Ap', testament: 'Nouveau', book_order: 66, chapter_count: 22 }
  ],
  
  // Quelques versets d'exemple pour commencer
  sampleVerses: [
    {
      book: 'Genèse',
      chapter: 1,
      verses: [
        { number: 1, text: 'Au commencement, Dieu créa les cieux et la terre.' },
        { number: 2, text: 'La terre était informe et vide : il y avait des ténèbres à la surface de l\'abîme, et l\'esprit de Dieu se mouvait au-dessus des eaux.' },
        { number: 3, text: 'Dieu dit : Que la lumière soit ! Et la lumière fut.' }
      ]
    },
    {
      book: 'Jean',
      chapter: 3,
      verses: [
        { number: 16, text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.' }
      ]
    },
    {
      book: 'Psaumes',
      chapter: 23,
      verses: [
        { number: 1, text: 'L\'Éternel est mon berger : je ne manquerai de rien.' },
        { number: 2, text: 'Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.' },
        { number: 3, text: 'Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom.' }
      ]
    },
    {
      book: 'Matthieu',
      chapter: 5,
      verses: [
        { number: 3, text: 'Heureux les pauvres en esprit, car le royaume des cieux est à eux !' },
        { number: 4, text: 'Heureux les affligés, car ils seront consolés !' },
        { number: 5, text: 'Heureux les débonnaires, car ils hériteront la terre !' }
      ]
    },
    {
      book: 'Romains',
      chapter: 8,
      verses: [
        { number: 28, text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.' }
      ]
    },
    {
      book: 'Philippiens',
      chapter: 4,
      verses: [
        { number: 13, text: 'Je puis tout par celui qui me fortifie.' }
      ]
    }
  ]
};

async function seed() {
  console.log('🌱 Début du peuplement de la base de données...');
  
  try {
    const db = getDatabase();
    
    // Vérifier si des données existent déjà
    const existingBooks = await db.get('SELECT COUNT(*) as count FROM books');
    if (existingBooks.count > 0) {
      console.log('ℹ️  Des données existent déjà, arrêt du peuplement');
      return;
    }
    
    console.log('📚 Insertion des livres...');
    
    // Insérer les livres
    for (const book of bibleData.books) {
      await db.run(
        'INSERT INTO books (name, abbreviation, testament, book_order, chapter_count) VALUES (?, ?, ?, ?, ?)',
        [book.name, book.abbreviation, book.testament, book.book_order, book.chapter_count]
      );
    }
    
    console.log('📖 Insertion des chapitres et versets d\'exemple...');
    
    // Insérer les chapitres et versets d'exemple
    for (const sampleBook of bibleData.sampleVerses) {
      // Récupérer l'ID du livre
      const book = await db.get('SELECT id FROM books WHERE name = ?', [sampleBook.book]);
      if (!book) continue;
      
      // Insérer le chapitre
      const chapterResult = await db.run(
        'INSERT INTO chapters (book_id, chapter_number, verse_count) VALUES (?, ?, ?)',
        [book.id, sampleBook.chapter, sampleBook.verses.length]
      );
      
      // Insérer les versets
      for (const verse of sampleBook.verses) {
        await db.run(
          'INSERT INTO verses (chapter_id, verse_number, text) VALUES (?, ?, ?)',
          [chapterResult.id, verse.number, verse.text]
        );
      }
    }
    
    console.log('📊 Création d\'un plan de lecture exemple...');
    
    // Créer un plan de lecture exemple
    const planResult = await db.run(
      'INSERT INTO reading_plans (name, description, duration_days) VALUES (?, ?, ?)',
      ['Plan de lecture en 30 jours', 'Un plan simple pour découvrir les passages essentiels de la Bible', 30]
    );
    
    // Ajouter quelques étapes au plan
    const planSteps = [
      { day: 1, book: 'Genèse', start_chapter: 1, end_chapter: 3 },
      { day: 2, book: 'Psaumes', start_chapter: 1, end_chapter: 5 },
      { day: 3, book: 'Matthieu', start_chapter: 1, end_chapter: 2 },
      { day: 4, book: 'Jean', start_chapter: 1, end_chapter: 1 },
      { day: 5, book: 'Romains', start_chapter: 1, end_chapter: 1 }
    ];
    
    for (const step of planSteps) {
      const book = await db.get('SELECT id FROM books WHERE name = ?', [step.book]);
      if (book) {
        await db.run(
          'INSERT INTO reading_plan_steps (plan_id, day_number, book_id, start_chapter, end_chapter) VALUES (?, ?, ?, ?, ?)',
          [planResult.id, step.day, book.id, step.start_chapter, step.end_chapter]
        );
      }
    }
    
    console.log('✅ Peuplement terminé avec succès !');
    
    // Afficher les statistiques
    const stats = await Promise.all([
      db.get('SELECT COUNT(*) as count FROM books'),
      db.get('SELECT COUNT(*) as count FROM chapters'),
      db.get('SELECT COUNT(*) as count FROM verses')
    ]);
    
    console.log(`📊 Statistiques:`);
    console.log(`   - Livres: ${stats[0].count}`);
    console.log(`   - Chapitres: ${stats[1].count}`);
    console.log(`   - Versets: ${stats[2].count}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
    process.exit(1);
  }
}

// Exécuter le peuplement si ce script est appelé directement
if (require.main === module) {
  seed().then(() => {
    console.log('🎉 Base de données peuplée !');
    process.exit(0);
  });
}

module.exports = { seed };

