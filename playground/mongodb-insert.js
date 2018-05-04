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

  // Inserting into a collection - first way using callback
  col.insert({text: 'Second task that should be added'}, (err, res) => {
    if(err) {
      console.log(`There was an error inserting into collection`);
      return;
    }
    console.log(`Document successfully inserted into collection!`);
    console.log(res);
  });

  // Inserting into a collection - second way using promises
  col.insert({text: 'Third task that should be added'}).then((res) => {
    console.log(`Insertion into collection successful!`);
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  // Insert objects into Users collection
  db.collection('Users').insert([{
    name: `Tejas`,
    age: 25,
    profession: `Software Engineer`
  }, {
    name: `Ankit`,
    age: 26,
    profession: `CTO`
  }]).then((res) => {
    console.log(`Result: `, JSON.stringify(res, undefined, 2));
  }, (err) => {
    console.log(`Error: ${err}`);
  });

  client.close();
}
