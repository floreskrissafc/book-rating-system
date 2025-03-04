CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	role INT NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255) DEFAULT "imgs/user_profiles/default_profile.png" NOT NULL
);

INSERT OR IGNORE INTO users (email, password_hash, role, first_name, last_name) VALUES
						('user1@student.london.ac.uk', '$2b$10$0rMDoiQRTGn/oZ1Vx7NwEOeTcXUKVnKDHRcXEGLg5uE6dUP1FQ.H2', 0, 'user1', 'one'),
						('user2@student.london.ac.uk', '$2b$10$0rMDoiQRTGn/oZ1Vx7NwEOeTcXUKVnKDHRcXEGLg5uE6dUP1FQ.H2', 0, 'user2', 'two')