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
  var col = db.collection('Todos');

  // Finding everything from collection using promise (We will use this by default)
  col.find({}).toArray().then((res) => {
    console.log(`Result fetched successfully!`);
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  // Find items with completed set to true in Todos collection
  db.collection('Todos').find({
    completed: true
  }).toArray().then((res) => {
      console.log(JSON.stringify(res, undefined, 2));
  });

  // Find all users from Users collection
  db.collection('Users').find({}).toArray().then((res) => {
    console.log(`Result: `, JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  // Find specific user with age:25 from Users collection
  db.collection('Users').find({
    age: 26
  }).toArray().then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });


  client.close();

}
