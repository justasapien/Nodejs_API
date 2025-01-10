const express = require('express');
const db = require('../models/posts');
const router = express.Router();

// create a post 
router.post('/', (req, res) => {
    const { title, content, userId } = req.body;
    db.run(`INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)`, [title, content, userId], function (err) {
        if (err) { 
            return res.status(500).json({ error: err.message }); 
        }
        res.json({ id: this.lastID });
    });
});

// get all the posts
router.get('/', (req, res) => {
    db.all(`SELECT * FROM posts`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } 
        res.json(rows);
    });
});

// get post by ID
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM posts WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});


// update post
router.put('/:id', (req, res) => {
    const { title, content, userId } = req.body;
    db.run(`UPDATE posts SET title = ?, content = ?, userId = ? WHERE id = ?`, [title, content, userId, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ updatedRows: this.changes });
    });
});

// delete post
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM posts WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedRows: this.changes });
    });
});

module.exports = router;
