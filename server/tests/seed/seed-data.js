const {ObjectID} = require('mongodb');
const {User} = require('./../../models/user');
const {Todo} = require('./../../models/todo');
const {secret} = require('./../../utils/keys');
const jwt = require('jsonwebtoken');

const userOneObject = new ObjectID();
const userTwoObject = new ObjectID();

const todos = [{
  _id: new ObjectID(),
  text: 'First task for test suite',
  _creator: userOneObject
}, {
  _id: new ObjectID(),
  text: 'Second task for test suite',
  _creator: userTwoObject
}];

const users = [{
  _id: userOneObject,
  name: "Tejas Nikumbh",
  age: 25,
  email: "tejnikumbh@gmail.com",
  password: "userOnePass",
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneObject, access: 'auth'}, secret)
  }]
},{
  _id: userTwoObject,
  name: "Tejas Chaudhari",
  age: 26,
  email: "tejastalk@gmail.com",
  password: "userTwoPass",
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoObject, access: 'auth'}, secret)
  }]
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  }).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers};
