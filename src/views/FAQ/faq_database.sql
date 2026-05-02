-- ============================================================
-- Schéma FAQ pour Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL de ton projet Supabase
-- ============================================================

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) DEFAULT 'Anonyme',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des réponses
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des tags
CREATE TABLE IF NOT EXISTS tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#3b82f6'
);

-- Table de liaison questions-tags
CREATE TABLE IF NOT EXISTS question_tags (
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_questions_updated_at ON questions;
CREATE TRIGGER trg_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_answers_updated_at ON answers;
CREATE TRIGGER trg_answers_updated_at
  BEFORE UPDATE ON answers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire et créer des questions
DROP POLICY IF EXISTS "questions_select" ON questions;
CREATE POLICY "questions_select" ON questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "questions_insert" ON questions;
CREATE POLICY "questions_insert" ON questions FOR INSERT WITH CHECK (true);
-- Seul l'admin (authentifié) peut modifier/supprimer
DROP POLICY IF EXISTS "questions_update" ON questions;
CREATE POLICY "questions_update" ON questions FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "questions_delete" ON questions;
CREATE POLICY "questions_delete" ON questions FOR DELETE USING (auth.role() = 'authenticated');

-- Tout le monde peut lire les réponses, seul l'admin peut écrire
DROP POLICY IF EXISTS "answers_select" ON answers;
CREATE POLICY "answers_select" ON answers FOR SELECT USING (true);
DROP POLICY IF EXISTS "answers_insert" ON answers;
CREATE POLICY "answers_insert" ON answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "answers_update" ON answers;
CREATE POLICY "answers_update" ON answers FOR UPDATE USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "answers_delete" ON answers;
CREATE POLICY "answers_delete" ON answers FOR DELETE USING (auth.role() = 'authenticated');

-- Tags : lecture publique
DROP POLICY IF EXISTS "tags_select" ON tags;
CREATE POLICY "tags_select" ON tags FOR SELECT USING (true);

-- question_tags : lecture publique, écriture à la création de question
DROP POLICY IF EXISTS "question_tags_select" ON question_tags;
CREATE POLICY "question_tags_select" ON question_tags FOR SELECT USING (true);
DROP POLICY IF EXISTS "question_tags_insert" ON question_tags;
CREATE POLICY "question_tags_insert" ON question_tags FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "question_tags_delete" ON question_tags;
CREATE POLICY "question_tags_delete" ON question_tags FOR DELETE USING (auth.role() = 'authenticated');

-- Insertion des tags par défaut (classes Guild Wars 2 + tags généraux)
INSERT INTO tags (name, color) VALUES
  ('Guerrier', '#FF6B6B'),
  ('Gardien', '#4ECDC4'),
  ('Revenant', '#95E1D3'),
  ('Voleur', '#F38181'),
  ('Rodeur', '#AAE3E2'),
  ('Ingénieur', '#FFD93D'),
  ('Nécromant', '#6BCB77'),
  ('Envouteur', '#4D96FF'),
  ('Elementaliste', '#FF6B9D'),
  ('Général', '#9B9B9B'),
  ('Technique', '#5C7AEA'),
  ('Bug', '#E74C3C'),
  ('Feature', '#2ECC71'),
  ('Aide', '#F39C12'),
  ('Autre', '#95A5A6')
ON CONFLICT (name) DO NOTHING;

