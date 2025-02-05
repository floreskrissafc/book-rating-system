CREATE TABLE IF NOT EXISTS modules_books
 (
	book_id INT,
	module_id INT,
	PRIMARY KEY (book_id, module_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
	FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);
