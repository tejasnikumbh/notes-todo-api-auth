const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');

const url = "mongodb://localhost:27017"

MongoClient.connect(url, (err, client) => {
  if(err) {
    console.log(`There was an error in establishing connection to mongo-db`);
    console.log(`Error: \n  ${err}`);
    return;
  }

  console.log(`Connection to mongo-db was successful!`);

  var db = client.db('test');

  // We can do all operations using promises or callbacks
  // ========================================================

  // var col = db.collection('Todos');
  // Inserting into a collection - first way using callback
  // col.insert({text: 'Second task that should be added'}, (err, res) => {
  //   if(err) {
  //     console.log(`There was an error inserting into collection`);
  //     return;
  //   }
  //   console.log(`Document successfully inserted into collection!`);
  //   console.log(res);
  // });

  // Inserting into a collection - second way using promises
  // col.insert({text: 'Third task that should be added'}).then((res) => {
  //   console.log(`Insertion into collection successful!`);
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Finding everything from collection using promise (We will use this by default)
  // col.find({}).toArray().then((res) => {
  //   console.log(`Result fetched successfully!`);
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  //client.close();

  // Insert into Todos collection
  // db.collection('Todos').insert([{
  //   task: `First task to be done`,
  //   completed: false
  // }, {
  //   task: `Second task to be done`,
  //   completed: false
  // }]).then((res) => {
  //   console.log(`Result: `, JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Find all from Todos collection
  // db.collection('Todos').find({}).toArray().then((res) => {
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Find completed = true from collection
  // db.collection('Todos').find({
  //   completed: true
  // }).toArray().then((res) => {
  //     console.log(JSON.stringify(res, undefined, 2));
  // });
  //

  // Insert into Users collection
  // db.collection('Users').insert([{
  //   name: `Tejas`,
  //   age: 25,
  //   profession: `Software Engineer`
  // }, {
  //   name: `Ankit`,
  //   age: 26,
  //   profession: `CTO`
  // }]).then((res) => {
  //   console.log(`Result: `, JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Find all users from Users collection
  // db.collection('Users').find({}).toArray().then((res) => {
  //   console.log(`Result: `, JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Find specific user with age:25 from Users collection
  // db.collection('Users').find({
  //   age: 26
  // }).toArray().then((res) => {
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Delete specific ONE document from collection
  // db.collection('Todos').deleteOne({ completed: true }).then((res) => {
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Delete specific MANY documents from collection
  // db.collection('Todos').deleteMany({ completed: true }).then((res) => {
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Delete specific ONE document and return the result
  // db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => {
  //   console.log(`Error: ${err}`);
  // });

  // Updates a specific document and returns the modified or original depending on options
  // db.collection('Users').updateOne(
  //   { _id: new ObjectID("5adb7c33af58ed1153e39abf") }, // Filtering criteria
  //   { // The update with update operators
  //     $set: {
  //       name: `Chaudhari`
  //     },
  //     $inc: {
  //       age: 1
  //     }
  //   },
  //   {
  //     requiredOriginal: true
  //   }
  // ).then((res) => { // success callback
  //   console.log(JSON.stringify(res, undefined, 2));
  // }, (err) => { // failure callback
  //   console.log(`Error: ${err}`);
  // });

  client.close();
  
});
