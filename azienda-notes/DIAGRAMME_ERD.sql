-- =====================================================
-- DIAGRAMME ERD - APPLICATION "MYNOTE"
-- Compatible avec dbdiagram.io et MySQL Workbench
-- =====================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS mynote_db;
USE mynote_db;

-- =====================================================
-- TABLE PRINCIPALE : NOTES
-- =====================================================

CREATE TABLE notes (
    -- Identifiant unique de la note
    id VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'Identifiant unique de la note',
    
    -- Titre de la note (obligatoire)
    title VARCHAR(255) NOT NULL COMMENT 'Titre de la note (obligatoire)',
    
    -- Contenu de la note (optionnel)
    content TEXT NULL COMMENT 'Contenu détaillé de la note (optionnel)',
    
    -- Date et heure de création
    dateTime DATETIME NOT NULL COMMENT 'Date et heure de création de la note',
    
    -- Niveau de priorité
    importance ENUM('Important', 'Normal', 'Low') NOT NULL DEFAULT 'Normal' 
        COMMENT 'Niveau de priorité de la note',
    
    -- Timestamps automatiques
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT 'Date de dernière modification',
    
    -- Index pour optimiser les performances
    INDEX idx_notes_datetime (dateTime),
    INDEX idx_notes_importance (importance),
    INDEX idx_notes_title (title),
    
    -- Contraintes de validation
    CONSTRAINT chk_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_datetime_valid CHECK (dateTime IS NOT NULL),
    CONSTRAINT chk_importance_valid CHECK (importance IN ('Important', 'Normal', 'Low'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table principale pour stocker les notes de l''application mynote';

-- =====================================================
-- TABLE DE RÉFÉRENCE : IMPORTANCE_LEVELS
-- =====================================================

CREATE TABLE importance_levels (
    -- Identifiant du niveau de priorité
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant du niveau de priorité',
    
    -- Code du niveau
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Code unique du niveau',
    
    -- Nom du niveau
    name VARCHAR(50) NOT NULL COMMENT 'Nom du niveau de priorité',
    
    -- Description
    description TEXT NULL COMMENT 'Description du niveau de priorité',
    
    -- Couleur associée
    color_hex VARCHAR(7) NOT NULL COMMENT 'Couleur hexadécimale associée',
    
    -- Ordre d'affichage
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Ordre d''affichage',
    
    -- Statut actif/inactif
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Statut actif/inactif',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_importance_code (code),
    INDEX idx_importance_order (display_order),
    INDEX idx_importance_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table de référence pour les niveaux de priorité';

-- =====================================================
-- TABLE DE RÉFÉRENCE : USERS (pour extension future)
-- =====================================================

CREATE TABLE users (
    -- Identifiant de l'utilisateur
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant unique de l''utilisateur',
    
    -- Nom d'utilisateur
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nom d''utilisateur unique',
    
    -- Email
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Adresse email unique',
    
    -- Mot de passe hashé
    password_hash VARCHAR(255) NOT NULL COMMENT 'Mot de passe hashé',
    
    -- Nom complet
    full_name VARCHAR(100) NULL COMMENT 'Nom complet de l''utilisateur',
    
    -- Statut du compte
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Statut actif/inactif',
    
    -- Date de dernière connexion
    last_login DATETIME NULL COMMENT 'Date de dernière connexion',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des utilisateurs (pour extension future)';

-- =====================================================
-- TABLE DE RÉFÉRENCE : CATEGORIES (pour extension future)
-- =====================================================

CREATE TABLE categories (
    -- Identifiant de la catégorie
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identifiant unique de la catégorie',
    
    -- Nom de la catégorie
    name VARCHAR(100) NOT NULL COMMENT 'Nom de la catégorie',
    
    -- Description
    description TEXT NULL COMMENT 'Description de la catégorie',
    
    -- Couleur associée
    color_hex VARCHAR(7) NULL COMMENT 'Couleur hexadécimale associée',
    
    -- Icône
    icon_name VARCHAR(50) NULL COMMENT 'Nom de l''icône associée',
    
    -- Ordre d'affichage
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Ordre d''affichage',
    
    -- Statut actif/inactif
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Statut actif/inactif',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index
    INDEX idx_categories_name (name),
    INDEX idx_categories_order (display_order),
    INDEX idx_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des catégories de notes (pour extension future)';

-- =====================================================
-- INSERTION DES DONNÉES DE RÉFÉRENCE
-- =====================================================

-- Insertion des niveaux de priorité
INSERT INTO importance_levels (code, name, description, color_hex, display_order) VALUES
('important', 'Important', 'Notes de haute priorité nécessitant une attention immédiate', '#F45889', 1),
('normal', 'Normal', 'Notes de priorité standard', '#456990', 2),
('low', 'Low', 'Notes de faible priorité', '#7EE4EC', 3);

-- Insertion des catégories par défaut
INSERT INTO categories (name, description, color_hex, icon_name, display_order) VALUES
('Général', 'Notes générales sans catégorie spécifique', '#456990', 'note', 1),
('Travail', 'Notes liées au travail professionnel', '#F45889', 'work', 2),
('Personnel', 'Notes personnelles et privées', '#7EE4EC', 'person', 3),
('Urgent', 'Notes nécessitant une action immédiate', '#FF3B30', 'warning', 4);

-- =====================================================
-- RELATIONS ET CONTRAINTES DE CLÉS ÉTRANGÈRES
-- =====================================================

-- Ajout de la colonne user_id à la table notes (pour extension future)
ALTER TABLE notes ADD COLUMN user_id INT NULL COMMENT 'Référence vers l''utilisateur propriétaire';

-- Ajout de la colonne category_id à la table notes (pour extension future)
ALTER TABLE notes ADD COLUMN category_id INT NULL COMMENT 'Référence vers la catégorie';

-- Contraintes de clés étrangères
ALTER TABLE notes 
ADD CONSTRAINT fk_notes_user 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE notes 
ADD CONSTRAINT fk_notes_category 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les notes avec informations complètes
CREATE VIEW v_notes_complete AS
SELECT 
    n.id,
    n.title,
    n.content,
    n.dateTime,
    n.importance,
    n.created_at,
    n.updated_at,
    u.username as owner_username,
    c.name as category_name,
    c.color_hex as category_color,
    il.color_hex as importance_color
FROM notes n
LEFT JOIN users u ON n.user_id = u.id
LEFT JOIN categories c ON n.category_id = c.id
LEFT JOIN importance_levels il ON n.importance = il.code
WHERE n.id IS NOT NULL;

-- Vue pour les statistiques des notes
CREATE VIEW v_notes_stats AS
SELECT 
    COUNT(*) as total_notes,
    COUNT(CASE WHEN importance = 'Important' THEN 1 END) as important_notes,
    COUNT(CASE WHEN importance = 'Normal' THEN 1 END) as normal_notes,
    COUNT(CASE WHEN importance = 'Low' THEN 1 END) as low_notes,
    COUNT(CASE WHEN content IS NOT NULL AND LENGTH(TRIM(content)) > 0 THEN 1 END) as notes_with_content,
    MIN(dateTime) as oldest_note,
    MAX(dateTime) as newest_note
FROM notes;

-- =====================================================
-- PROCÉDURES STOCKÉES UTILES
-- =====================================================

DELIMITER //

-- Procédure pour créer une nouvelle note
CREATE PROCEDURE sp_create_note(
    IN p_title VARCHAR(255),
    IN p_content TEXT,
    IN p_importance ENUM('Important', 'Normal', 'Low'),
    IN p_user_id INT
)
BEGIN
    DECLARE v_note_id VARCHAR(255);
    
    -- Génération d'un ID unique
    SET v_note_id = CONCAT('note_', UNIX_TIMESTAMP(), '_', FLOOR(RAND() * 1000));
    
    -- Insertion de la note
    INSERT INTO notes (id, title, content, dateTime, importance, user_id)
    VALUES (v_note_id, p_title, p_content, NOW(), p_importance, p_user_id);
    
    -- Retour de l'ID créé
    SELECT v_note_id as note_id;
END //

-- Procédure pour mettre à jour une note
CREATE PROCEDURE sp_update_note(
    IN p_note_id VARCHAR(255),
    IN p_title VARCHAR(255),
    IN p_content TEXT,
    IN p_importance ENUM('Important', 'Normal', 'Low')
)
BEGIN
    UPDATE notes 
    SET title = p_title,
        content = p_content,
        importance = p_importance,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_note_id;
    
    SELECT ROW_COUNT() as rows_affected;
END //

-- Procédure pour supprimer une note
CREATE PROCEDURE sp_delete_note(
    IN p_note_id VARCHAR(255)
)
BEGIN
    DELETE FROM notes WHERE id = p_note_id;
    SELECT ROW_COUNT() as rows_affected;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS POUR LA MAINTENANCE
-- =====================================================

DELIMITER //

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER tr_notes_update_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Trigger pour valider les données avant insertion
CREATE TRIGGER tr_notes_validate_insert
BEFORE INSERT ON notes
FOR EACH ROW
BEGIN
    -- Validation du titre
    IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Le titre de la note ne peut pas être vide';
    END IF;
    
    -- Validation de l'importance
    IF NEW.importance NOT IN ('Important', 'Normal', 'Low') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Le niveau d''importance doit être Important, Normal ou Low';
    END IF;
END //

DELIMITER ;

-- =====================================================
-- INDEX SUPPLÉMENTAIRES POUR LES PERFORMANCES
-- =====================================================

-- Index composite pour les requêtes fréquentes
CREATE INDEX idx_notes_user_importance ON notes(user_id, importance);
CREATE INDEX idx_notes_category_importance ON notes(category_id, importance);
CREATE INDEX idx_notes_datetime_importance ON notes(dateTime, importance);

-- Index pour les recherches textuelles
CREATE FULLTEXT INDEX idx_notes_title_content ON notes(title, content);

-- =====================================================
-- COMMENTAIRES FINAUX
-- =====================================================

/*
DIAGRAMME ERD - APPLICATION MYNOTE
==================================

STRUCTURE PRINCIPALE :
- Table NOTES : Entité centrale de l'application
- Table IMPORTANCE_LEVELS : Référence pour les niveaux de priorité
- Table USERS : Extension future pour multi-utilisateurs
- Table CATEGORIES : Extension future pour catégorisation

RELATIONS :
- NOTES -> USERS (Many-to-One) : Chaque note appartient à un utilisateur
- NOTES -> CATEGORIES (Many-to-One) : Chaque note peut avoir une catégorie
- NOTES -> IMPORTANCE_LEVELS (Many-to-One) : Chaque note a un niveau de priorité

FONCTIONNALITÉS :
- CRUD complet sur les notes
- Validation des données
- Index optimisés pour les performances
- Vues pour les requêtes complexes
- Procédures stockées pour les opérations courantes
- Triggers pour la maintenance automatique

EXTENSIONS FUTURES :
- Système d'utilisateurs
- Catégorisation des notes
- Tags et étiquettes
- Partage de notes
- Historique des modifications
*/ 