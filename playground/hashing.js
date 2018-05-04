const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
  id: 6
};

var token = jwt.sign(data, 'abc123');
console.log(token);
var decoded = jwt.verify(token, 'abc123');
console.log("======================================");
console.log(decoded);


// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'abc123').toString()
// };
//
// var originalHash = token.hash;
//
// data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString()
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'abc123').toString();
// if(resultHash === token.hash) {
//   console.log('Data was not manipulated');
// } else {
//   console.log('Data was manipulated. Do not trust!');
// }
