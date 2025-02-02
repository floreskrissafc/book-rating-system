CREATE TABLE IF NOT EXISTS books_courses (
	book_id INT,
	course_id INT,
	PRIMARY KEY (book_id, course_id),
	FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
	FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
