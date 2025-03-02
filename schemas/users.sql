CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role INT NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255)
);

INSERT OR IGNORE INTO admin_emails (email) VALUES
						('user1@student.london.ac.uk'),
						('user2@student.london.ac.uk')