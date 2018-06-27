const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Users = require('../models/users');

const usersRouter = express.Router();

usersRouter.use(bodyParser.json());

usersRouter.route('/')
.get((req, res, next) => {
    Users.find({})
    .then((users) => {
        console.log('retrieved users ', users)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    Users.create(req.body)
    .then((user) => {
        console.log('user Created ', user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete((req, res, next) => {
    Users.remove({})
    .then((resp) => {
        res.statusCode = 200;
        console.log('res',res)
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

usersRouter.route('/:userId')
.get((req, res, next) => {
    Users.findById(req.params.userId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported ' + req.params.userId);
})
.put((req, res, next) => {
    Users.findByIdAndUpdate(req.params.userId, {
        $set: req.body
    }, { new: true })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err));
});

usersRouter.route('/:userId/comments')
.get((req, res, next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user.comments);
        }
        else {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    console.log('post call', req.body)
    Users.findById(req.params.userId)
    .then((user) => {
        console.log('user Created ', user);
        if (user != null) {
            user.comments.push(req.body);
            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err));           
        }
        else {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Users/' + req.params.userId + '/comments');
})
.delete((req, res, next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null) {
            for ( var i = (user.comments.length -1); i>=0; i--) {
                user.comments.id(user.comments[i]._id).remove();
            }
            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err));   
        }
        else {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

usersRouter.route('/:userId/comments/:commentId')
.get((req, res, next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null && user.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user.comments.id(req.params.commentId));
        }
        else if (user == null) {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' does not exist!!');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported ' + req.params.userId + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null && user.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                user.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                user.comments.id(req.params.commentId).comment = req.body.comment;
            }
            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err));
        } else if (user == null) {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' does not exist!!');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Users.findById(req.params.userId)
    .then((user) => {
        if (user != null && user.comments.id(req.params.commentId) != null) {
            
            user.comments.id(req.params.commentId).remove();
            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err));   
        }
        else if (user == null) {
            err = new Error('user ' + req.params.userId + ' does not exist!!');
            err.status = 404;
            return next(err);
        } else {
            err = new Error('Comment ' + req.params.commentId + ' does not exist!!');
            err.status = 404;
            return next(err); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = usersRouter;