-- =====================================================
-- ERD DIAGRAM - "MYNOTE" APPLICATION
-- Compatible with dbdiagram.io and MySQL Workbench
-- =====================================================

-- Database creation
CREATE DATABASE IF NOT EXISTS mynote_db;
USE mynote_db;

-- =====================================================
-- MAIN TABLE : NOTES
-- =====================================================

CREATE TABLE notes (
    -- Unique note identifier
    id VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'Unique note identifier',
    
    -- Note title (required)
    title VARCHAR(255) NOT NULL COMMENT 'Note title (required)',
    
    -- Note content (optional)
    content TEXT NULL COMMENT 'Detailed note content (optional)',
    
    -- Creation date and time
    dateTime DATETIME NOT NULL COMMENT 'Note creation date and time',
    
    -- Priority level
    importance ENUM('Important', 'Normal', 'Low') NOT NULL DEFAULT 'Normal' 
        COMMENT 'Note priority level',
    
    -- Automatic timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation date',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
        COMMENT 'Last modification date',
    
    -- Indexes for performance optimization
    INDEX idx_notes_datetime (dateTime),
    INDEX idx_notes_importance (importance),
    INDEX idx_notes_title (title),
    
    -- Validation constraints
    CONSTRAINT chk_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_datetime_valid CHECK (dateTime IS NOT NULL),
    CONSTRAINT chk_importance_valid CHECK (importance IN ('Important', 'Normal', 'Low'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Main table for storing mynote application notes';

-- =====================================================
-- REFERENCE TABLE : IMPORTANCE_LEVELS
-- =====================================================

CREATE TABLE importance_levels (
    -- Priority level identifier
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Priority level identifier',
    
    -- Level code
    code VARCHAR(20) NOT NULL UNIQUE COMMENT 'Unique level code',
    
    -- Level name
    name VARCHAR(50) NOT NULL COMMENT 'Priority level name',
    
    -- Description
    description TEXT NULL COMMENT 'Priority level description',
    
    -- Associated color
    color_hex VARCHAR(7) NOT NULL COMMENT 'Associated hexadecimal color',
    
    -- Display order
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Display order',
    
    -- Active/inactive status
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Active/inactive status',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_importance_code (code),
    INDEX idx_importance_order (display_order),
    INDEX idx_importance_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Reference table for priority levels';

-- =====================================================
-- REFERENCE TABLE : USERS (for future extension)
-- =====================================================

CREATE TABLE users (
    -- User identifier
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique user identifier',
    
    -- Username
    username VARCHAR(50) NOT NULL UNIQUE COMMENT 'Unique username',
    
    -- Email
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Unique email address',
    
    -- Hashed password
    password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    
    -- Full name
    full_name VARCHAR(100) NULL COMMENT 'User full name',
    
    -- Account status
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Active/inactive status',
    
    -- Last login date
    last_login DATETIME NULL COMMENT 'Last login date',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_users_username (username),
    INDEX idx_users_email (email),
    INDEX idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Users table (for future extension)';

-- =====================================================
-- REFERENCE TABLE : CATEGORIES (for future extension)
-- =====================================================

CREATE TABLE categories (
    -- Category identifier
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique category identifier',
    
    -- Category name
    name VARCHAR(100) NOT NULL COMMENT 'Category name',
    
    -- Description
    description TEXT NULL COMMENT 'Category description',
    
    -- Associated color
    color_hex VARCHAR(7) NULL COMMENT 'Associated hexadecimal color',
    
    -- Icon
    icon_name VARCHAR(50) NULL COMMENT 'Associated icon name',
    
    -- Display order
    display_order INT NOT NULL DEFAULT 0 COMMENT 'Display order',
    
    -- Active/inactive status
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Active/inactive status',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_categories_name (name),
    INDEX idx_categories_order (display_order),
    INDEX idx_categories_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Note categories table (for future extension)';

-- =====================================================
-- REFERENCE DATA INSERTION
-- =====================================================

-- Priority levels insertion
INSERT INTO importance_levels (code, name, description, color_hex, display_order) VALUES
('important', 'Important', 'High priority notes requiring immediate attention', '#F45889', 1),
('normal', 'Normal', 'Standard priority notes', '#456990', 2),
('low', 'Low', 'Low priority notes', '#7EE4EC', 3);

-- Default categories insertion
INSERT INTO categories (name, description, color_hex, icon_name, display_order) VALUES
('General', 'General notes without specific category', '#456990', 'note', 1),
('Work', 'Work-related professional notes', '#F45889', 'work', 2),
('Personal', 'Personal and private notes', '#7EE4EC', 'person', 3),
('Urgent', 'Notes requiring immediate action', '#FF3B30', 'warning', 4);

-- =====================================================
-- RELATIONS AND FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Adding user_id column to notes table (for future extension)
ALTER TABLE notes ADD COLUMN user_id INT NULL COMMENT 'Reference to owner user';

-- Adding category_id column to notes table (for future extension)
ALTER TABLE notes ADD COLUMN category_id INT NULL COMMENT 'Reference to category';

-- Foreign key constraints
ALTER TABLE notes 
ADD CONSTRAINT fk_notes_user 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE notes 
ADD CONSTRAINT fk_notes_category 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE SET NULL ON UPDATE CASCADE;

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- View for notes with complete information
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

-- View for note statistics
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
-- USEFUL STORED PROCEDURES
-- =====================================================

DELIMITER //

-- Procedure to create a new note
CREATE PROCEDURE sp_create_note(
    IN p_title VARCHAR(255),
    IN p_content TEXT,
    IN p_importance ENUM('Important', 'Normal', 'Low'),
    IN p_user_id INT
)
BEGIN
    DECLARE v_note_id VARCHAR(255);
    
    -- Unique ID generation
    SET v_note_id = CONCAT('note_', UNIX_TIMESTAMP(), '_', FLOOR(RAND() * 1000));
    
    -- Note insertion
    INSERT INTO notes (id, title, content, dateTime, importance, user_id)
    VALUES (v_note_id, p_title, p_content, NOW(), p_importance, p_user_id);
    
    -- Return created ID
    SELECT v_note_id as note_id;
END //

-- Procedure to update a note
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

-- Procedure to delete a note
CREATE PROCEDURE sp_delete_note(
    IN p_note_id VARCHAR(255)
)
BEGIN
    DELETE FROM notes WHERE id = p_note_id;
    SELECT ROW_COUNT() as rows_affected;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS FOR MAINTENANCE
-- =====================================================

DELIMITER //

-- Trigger to automatically update updated_at
CREATE TRIGGER tr_notes_update_timestamp
BEFORE UPDATE ON notes
FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

-- Trigger to validate data before insertion
CREATE TRIGGER tr_notes_validate_insert
BEFORE INSERT ON notes
FOR EACH ROW
BEGIN
    -- Title validation
    IF NEW.title IS NULL OR LENGTH(TRIM(NEW.title)) = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Note title cannot be empty';
    END IF;
    
    -- Importance validation
    IF NEW.importance NOT IN ('Important', 'Normal', 'Low') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Importance level must be Important, Normal or Low';
    END IF;
END //

DELIMITER ;

-- =====================================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite index for frequent queries
CREATE INDEX idx_notes_user_importance ON notes(user_id, importance);
CREATE INDEX idx_notes_category_importance ON notes(category_id, importance);
CREATE INDEX idx_notes_datetime_importance ON notes(dateTime, importance);

-- Index for text searches
CREATE FULLTEXT INDEX idx_notes_title_content ON notes(title, content);

-- =====================================================
-- FINAL COMMENTS
-- =====================================================

/*
ERD DIAGRAM - MYNOTE APPLICATION
================================

MAIN STRUCTURE :
- NOTES table : Central entity of the application
- IMPORTANCE_LEVELS table : Reference for priority levels
- USERS table : Future extension for multi-users
- CATEGORIES table : Future extension for categorization

RELATIONS :
- NOTES -> USERS (Many-to-One) : Each note belongs to a user
- NOTES -> CATEGORIES (Many-to-One) : Each note can have a category
- NOTES -> IMPORTANCE_LEVELS (Many-to-One) : Each note has a priority level

FEATURES :
- Complete CRUD on notes
- Data validation
- Optimized indexes for performance
- Views for complex queries
- Stored procedures for common operations
- Triggers for automatic maintenance

FUTURE EXTENSIONS :
- User system
- Note categorization
- Tags and labels
- Note sharing
- Modification history
*/ 