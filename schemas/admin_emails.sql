CREATE TABLE IF NOT EXISTS admin_emails (
	email VARCHAR(255) UNIQUE NOT NULL
);

INSERT OR IGNORE INTO admin_emails (email) VALUES
						('admin1@london.ac.uk'),
						('admin2@london.ac.uk')