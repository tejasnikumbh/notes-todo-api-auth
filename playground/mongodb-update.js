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

  // Updates a specific document and returns the modified or original depending on options
  db.collection('Users').updateOne(
    { _id: new ObjectID("5adb7c33af58ed1153e39abf") }, // Filtering criteria
    { // The update with update operators
      $set: {
        name: `Chaudhari`
      },
      $inc: {
        age: 1
      }
    },
    {
      requiredOriginal: true
    }
  ).then((res) => { // success callback
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => { // failure callback
    console.log(`Error: ${err}`);
  });

  client.close();
}
