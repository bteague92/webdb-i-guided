const express = require('express');

// database access using knex
const knex = require('../data/db-config.js'); // Renamed from db to knex

const router = express.Router();

router.get('/', (req, res) => {
    //select * from posts
    knex
        .select('*')
        .from('posts')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error getting posts"
            })
        })
});

router.get('/:id', (req, res) => {
    knex
        .select('*')
        .from('posts')
        // .where("id", "=", req.params.id)  ///another way to do the where
        .where({ id: req.params.id })
        .first() /// equivalent to post[0]
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error getting post"
            })
        })
});

router.post('/', (req, res) => {
    const postData = req.body;
    knex('posts')
        .insert(postData, "id") // second arguement will show warning with SQLite
        .then(ids => {
            ///returns an array of one element(last item inserted)
            const id = ids[0];

            /// returns the object and not just the id
            return knex('posts')
                .where({ id })
                .first()
                .then(post => {
                    res.status(200).json(post);
                })

            //// only returns the id
            res.status(200).json(id);
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error adding post"
            })
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params.id;
    const changes = req.body;
    knex('posts')
        .where({ id })
        .update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} records updated` });
            } else {
                res.status(404).json({ message: `post not found` })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error updating post"
            })
        })
});

router.delete('/:id', (req, res) => {
    knex('posts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: `${count} records deleted` });
            } else {
                res.status(404).json({ message: `couln't find that post` })
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Error deleting post"
            })
        })
});

module.exports = router;