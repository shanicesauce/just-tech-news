const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req,res) => {
    // res.render('homepage', {
    //     id: 1,
    //     post_url: 'https://handlebars.com/guide/',
    //     title: 'Handlebars Docs',
    //     created_at: new Date(),
    //     vote_count: 10, 
    //     comments: [{},{}],
    //     user: {
    //         username: 'test_user'
    //     }
    // })
    Post.findAll({
        attributes: ['id', 'post_url', 'title','created_at',
        [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 
            'vote_count'
        ]
    ],
        order: [['created_at', 'DESC']],
        include: [
        {
            model: Comment,
            attributes: ['id', 'comment_text','post_id','user_id','created_at'],
            include: {
                model: User,
                attributes: ['username']
            } 
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/login', (req,res) => {
    if (req.session.loggedIn){
        res.redirect('/');
        return
    }
    res.render('login');
});




module.exports = router;