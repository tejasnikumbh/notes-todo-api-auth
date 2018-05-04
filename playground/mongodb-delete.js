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

  // Delete specific ONE document from collection
  db.collection('Todos').deleteOne({ completed: true }).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  // Delete specific MANY documents from collection
  db.collection('Todos').deleteMany({ completed: true }).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  // Delete specific ONE document and return the result
  db.collection('Todos').findOneAndDelete({completed: false}).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  client.close();
}
