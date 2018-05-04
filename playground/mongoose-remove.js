const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

const id = "5addf3c5f534ce0d5d6e1cbe";

if(!ObjectID.isValid(id)) {
  return console.log(`Invalid object`);
}
// Useful for removing MANY items. Doesn't return document. Returns info about removal instead.
// Todo.remove({_id: id}).then((status) => {
//   console.log(status);
// }).catch((e) => {
//   console.log(e);
// });

// Useful for removing ONE by filter. Returns the document.
// Todo.findOneAndRemove({_id: id}).then((doc) => {
//   console.log(doc);
// }).catch((e) => {
//   console.log(e);
// });

// Useful if removal is by id. Returns the document
Todo.findByIdAndRemove(id).then((doc) => {
  console.log(doc);
}).catch((e) => {
  console.log(e);
});
