-- Schéma de base de données pour l'application biblique MedLam

-- Table des livres de la Bible
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL UNIQUE,
    testament TEXT NOT NULL CHECK (testament IN ('Ancien', 'Nouveau')),
    book_order INTEGER NOT NULL UNIQUE,
    chapter_count INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des chapitres
CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    verse_count INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(book_id, chapter_number)
);

-- Table des versets
CREATE TABLE IF NOT EXISTS verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    verse_number INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
    UNIQUE(chapter_id, verse_number)
);

-- Table des annotations utilisateur
CREATE TABLE IF NOT EXISTS annotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verse_id INTEGER NOT NULL,
    user_session TEXT NOT NULL, -- Pour identifier l'utilisateur (session ou IP)
    note TEXT NOT NULL,
    color TEXT DEFAULT '#fbbf24', -- Couleur de surlignage
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verse_id) REFERENCES verses(id) ON DELETE CASCADE
);

-- Table des plans de lecture
CREATE TABLE IF NOT EXISTS reading_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des étapes des plans de lecture
CREATE TABLE IF NOT EXISTS reading_plan_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    start_chapter INTEGER NOT NULL,
    end_chapter INTEGER NOT NULL,
    FOREIGN KEY (plan_id) REFERENCES reading_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE(plan_id, day_number)
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_verses_text ON verses(text);
CREATE INDEX IF NOT EXISTS idx_books_testament ON books(testament);
CREATE INDEX IF NOT EXISTS idx_books_order ON books(book_order);
CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_verses_chapter ON verses(chapter_id);
CREATE INDEX IF NOT EXISTS idx_annotations_verse ON annotations(verse_id);
CREATE INDEX IF NOT EXISTS idx_annotations_user ON annotations(user_session);

-- Index de recherche textuelle (FTS - Full Text Search)
CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
    verse_id UNINDEXED,
    book_name UNINDEXED,
    chapter_number UNINDEXED,
    verse_number UNINDEXED,
    text,
    content='verses',
    content_rowid='id'
);

-- Trigger pour maintenir l'index FTS à jour
CREATE TRIGGER IF NOT EXISTS verses_fts_insert AFTER INSERT ON verses BEGIN
    INSERT INTO verses_fts(verse_id, book_name, chapter_number, verse_number, text)
    SELECT 
        NEW.id,
        b.name,
        c.chapter_number,
        NEW.verse_number,
        NEW.text
    FROM chapters c
    JOIN books b ON c.book_id = b.id
    WHERE c.id = NEW.chapter_id;
END;

CREATE TRIGGER IF NOT EXISTS verses_fts_delete AFTER DELETE ON verses BEGIN
    DELETE FROM verses_fts WHERE verse_id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS verses_fts_update AFTER UPDATE ON verses BEGIN
    DELETE FROM verses_fts WHERE verse_id = OLD.id;
    INSERT INTO verses_fts(verse_id, book_name, chapter_number, verse_number, text)
    SELECT 
        NEW.id,
        b.name,
        c.chapter_number,
        NEW.verse_number,
        NEW.text
    FROM chapters c
    JOIN books b ON c.book_id = b.id
    WHERE c.id = NEW.chapter_id;
END;

-- Trigger pour mettre à jour updated_at dans annotations
CREATE TRIGGER IF NOT EXISTS update_annotations_timestamp 
AFTER UPDATE ON annotations
BEGIN
    UPDATE annotations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

