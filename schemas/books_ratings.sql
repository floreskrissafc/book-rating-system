CREATE TABLE IF NOT EXISTS books_ratings (
	book_id INT,
	user_id INT,
	comment TEXT,
	rating INT CHECK(rating BETWEEN 1 AND 5),
	PRIMARY KEY (book_id, user_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
