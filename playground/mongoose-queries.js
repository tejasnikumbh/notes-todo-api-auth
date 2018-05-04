const {ObjectID} = require('mongodb');
const mongoose = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

console.log(`Starting app...`);

// Sample id taken from database
const todo_id = "5addcb85112e36094250e1c4";

if(!ObjectID.isValid(todo_id)) {
  console.log(`Todo Object id is not valid.`);
}

// Finding ALL documents using filter and find
Todo.find({ _id: todo_id}).then((docs) => {
  console.log(docs);
}).catch((e) => {
  console.log(e.message);
});

// Finding ONE document using filter
Todo.findOne({_id: todo_id}).then((doc) => {
  console.log(doc);
}).catch((e) => {
  console.log(e.message);
});


// Finding ONE document using id. Simpler than one above
Todo.findById(todo_id).then((doc) => {
  console.log(doc);
}).catch((e) => {
  console.log(e.message);
});

console.log(`Finished executing app.`);
