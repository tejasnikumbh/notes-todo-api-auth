// Sets up the configuration
require('./config/config.js');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/middleware');

const app = express();
const port = process.env.PORT;

// Express middleware to convert request body to json
app.use(bodyParser.json());

// GET /todos endpoint - Used to get all todos from the database
app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then((todos) => {
    res.send({todos});
  }).catch((e) => {
    res.status(500).send();
  });
});

// POST /todos endpoint - Used to add a task to the database
app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator:req.user._id
  });

  todo.save().then((todo) => {
    res.send({todo});
  }).catch((e) => {
    // might be that validators failed so might be a bad request
    res.status(400).send();
  });
});

// GET /todos:id endpoint - Used to get particular todo from database
app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  Todo.findOne({_id: id, _creator: req.user._id }).then((todo) => {
    if(!todo) { return res.status(404).send(); }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send()
  })
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(400).send();
  }

  Todo.findOneAndRemove({_id: id, _creator: req.user._id }).then((todo)=>{
    if(!todo) { return res.status(404).send(); }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)) {
    return res.status(400).send();
  }

  // Creating patch body according to params received
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id },
     { $set: body }, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => { res.status(400).send() });
});

// POST /users - Used for signups
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['name', 'age', 'email', 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send();
  });
})

// POST /users/login - Used for login
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
})

// DELETE /users/me/token - Used for log out
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then((user) => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  })
})

// GET /users/me - Private route used for getting user information
app.get('/users/me', authenticate, (req, res) => {
  var user = req.user;
  res.send(user);
})

app.listen(port, () => {
  console.log(`Started listening on port ${port}`);
})

module.exports = {app}
