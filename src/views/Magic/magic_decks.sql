-- Création de la base de données
CREATE DATABASE IF NOT EXISTS magic_decks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE magic_decks;

-- Table des utilisateurs
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

-- Table des decks
CREATE TABLE decks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des cartes dans un deck
CREATE TABLE deck_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deck_id INT NOT NULL,
  card_id VARCHAR(100) NOT NULL, -- id Scryfall ou autre identifiant unique
  card_name VARCHAR(255) NOT NULL,
  card_data JSON, -- pour stocker les infos utiles de la carte
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);