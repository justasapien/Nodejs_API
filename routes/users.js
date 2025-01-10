const express = require('express');
const db = require('../models/users');
const router = express.Router();

// create a user
router.post('/', (req, res) => {
    const { name, email } = req.body;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function (err) {
        if (err){ 
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// get all the users
router.get('/', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err){ 
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// get user by id
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [req.params.id], (err, row) => {
        if (err){
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});


// get users with their posts
router.get('/users-with-posts', (req, res) => {
    const query = `
        SELECT 
            users.id AS userId,
            users.name AS userName,
            users.email AS userEmail,
            posts.id AS postId,
            posts.title AS postTitle,
            posts.content AS postContent
        FROM users
        LEFT JOIN posts ON users.id = posts.userId;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }

       
        const usersWithPosts = rows.reduce((acc, row) => {
            const { userId, userName, userEmail, postId, postTitle, postContent } = row;

            if (!acc[userId]) {
                acc[userId] = {
                    id: userId,
                    name: userName,
                    email: userEmail,
                    posts: []
                };
            }

          
            if (postId) {
                acc[userId].posts.push({
                    id: postId,
                    title: postTitle,
                    content: postContent
                });
            }

            return acc;
        }, {});

        
        res.json(Object.values(usersWithPosts));
    });
});




// update a user
router.put('/:id', (req, res) => {
    const { name, email } = req.body;
    db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [name, email, req.params.id], function (err) {
        if (err){ 
            return res.status(500).json({ error: err.message });
        }
        res.json({ updatedRows: this.changes });
    });
});

// delete a user
router.delete('/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function (err) {
        if (err){
             return res.status(500).json({ error: err.message });
        }
        res.json({ deletedRows: this.changes });
    });
});

module.exports = router;
