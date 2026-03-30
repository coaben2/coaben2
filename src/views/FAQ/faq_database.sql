-- Création de la base de données FAQ
CREATE DATABASE IF NOT EXISTS faq_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE faq_system;

-- Table des questions
CREATE TABLE IF NOT EXISTS questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100),
  status ENUM('pending', 'answered', 'archived') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des réponses
CREATE TABLE IF NOT EXISTS answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Table des tags
CREATE TABLE IF NOT EXISTS tags (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#3b82f6'
);

-- Table de liaison questions-tags
CREATE TABLE IF NOT EXISTS question_tags (
  question_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (question_id, tag_id),
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

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
ON DUPLICATE KEY UPDATE name=name;

