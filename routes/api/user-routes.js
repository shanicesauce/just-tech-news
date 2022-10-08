const router = require('express').Router();
const { User } = require('../../models');

//GET /api/users
router.get('/', (req,res) => {
    //access user model and run find all
    User.findAll( {
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1
router.get('/:id', (req,res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST /api/users
router.post('/', (req,res) => {
    //expects {username: 'name', email:'name@email.com, password: 'password1}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password:req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT /api/user/1
router.put('/:id', (req,res) => {
    //expects {username: 'name', email:'name@email.com, password: 'password1}
    //if req.body has exact key/value to match model . req.body is just fine
    User.update(req.body,{
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]){
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err)
    });
});

//DELETE /api/user/1
router.delete('/:id', (req,res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData){
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch (err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;