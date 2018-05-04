# Introduction
Node JS based REST API for managing user based todo-tasks with complete auhtentication and full test based coverage.

# Libraries used
Here are the libraries that I used while building this application

### REST API

```javascript
express.js
mongoose // (ORM)
mongodb // (Database Management)
```
### Testing 

``` javascript
mocha // (Testing framework)
supertest // (Testing Async calls for Express) 
chai // (Assertions Library)
```
### Hashing and Authentication

```javascript
jsonwebtoken // (Token generation and verification)
```

### Rapid Development
```javascript
Nodemon
```
# Tools Used
- Chrome Dev Tools (Inspector) for debugging

- Heroku Toolbelt - for Deployment

# Installation Instructions
Simply Download the project folder and Run 
```javascript
npm install
```
Then we can use the following commands to run the project
```javascript
node server/server/js
```
You can use the following for hot reloading
```javascript
nodemon server/server.js
```


In order to run the tests, use
``` javascript
npm test
```
or use the following command to run tests with hot-reloading
```javascript
npm run test-watch
```

