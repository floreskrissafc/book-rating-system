// This code must be added to the server to handle the upload of pictures
// into the imgs folder

const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();

// Configure multer to store images in 'uploads/profile_pictures/' folder
const storage = multer.diskStorage({
    destination: "./uploads/profile_pictures/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        } else {
            return cb(new Error("Only .jpg, .jpeg, and .png files are allowed"));
        }
    }
});

// API Route to handle file upload
app.post("/upload-profile", upload.single("profilePic"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const filePath = `/uploads/profile_pictures/${req.file.filename}`;
    res.json({ message: "Upload successful", filePath });
});

// Serve uploaded files as static files
app.use("/uploads", express.static("uploads"));

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
