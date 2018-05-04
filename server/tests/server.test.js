// Setting the environment to test
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed-data');

// Mocha is a framework so no need to require
// Assertions library useful for managing expectations and assertions
const {expect, assert, should } = require('chai');
// Useful for testing http requests
const request = require('supertest');
const lodash = require('lodash');
const {ObjectID} = require('mongodb');

// Setting up before running each it block
beforeEach(populateUsers);
beforeEach(populateTodos);
// POST /todos testing methods
describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'This is a new task';
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({text})
    .expect(200)
    .expect((res) => {
      // Testing the response
      expect(res.body.todo._creator).to.be.equal(users[0]._id.toHexString());
      expect(res.body.todo.text).to.be.equal(text);
    })
    .end((err, res) => {
      if(err) {
        return done(err); // done with an error object
      }
      // Testing database state after response: Check if Todo length is 1
      Todo.find({}).then((todos) => {
        expect(todos.length).to.be.equal(3);
        expect(todos[2].text).to.be.equal(text);
        done();
      }).catch((e) => {
        done(e);
      });
    })
  });

  it('should not create a todo with invalid object', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({ text: ""})
    .expect(400)
    .end((err, res) => {
      if(err) { // Error here means something went wrong after sending request
        return done(err);
      }
      // Testing database change after response
      Todo.find().then((docs) => {
        expect(docs.length).to.be.equal(2);
        done();
      }).catch((e) => done(e));
    });
  });

});

// GET /todos testing methods
describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      // Testing the response
      expect(res.body.todos.length).to.be.equal(1);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      // Testing the database change after response
      Todo.find({_creator: users[0]._id}).then((todos) => {
        expect(todos.length).to.be.equal(1);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });
});

// GET /todos/:id
describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      // Test the response
      expect(res.body.todo._creator).to.be.equal(todos[0]._creator.toHexString())
      expect(res.body.todo.text).to.be.equal(todos[0].text);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      // Test database change after response
      Todo.find().then((todos) => {
        expect(todos.length).to.be.equal(2);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

  it('should return 404 if todo not found', (done) => {
    const notFoundId = '6adde5b432c9a80b1e9bde1d';
    request(app)
    .get(`/todos/${notFoundId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .expect((res) => {
      // Testing the response
      expect(res.body).to.be.empty;
    })
    .end((err, res) => {
        if(err) {
          return done(err);
        }
        // Test the database change after the response
        Todo.find({}).then((todos) => {
          expect(todos.length).to.be.equal(2);
          done();
        }).catch((e) => done(e));
      });
    });


  it('should return 400 for non object ids', (done) => {
    request(app)
    .get(`/todos/123abc`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(400)
    .expect((res) => {
      // Testing the response
      expect(res.body).to.be.empty;
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      // Testing database change after response.
      Todo.find({}).then((todos) => {
        expect(todos.length).to.be.equal(2);
        done();
      }).catch((e) => done(e));
    });
  });

});

// DELETE /todos/:id testing methods
describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    const hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._creator).to.be.equal(users[1]._id.toHexString());
      expect(res.body.todo._id).to.be.equal(hexId);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }

      Todo.findById(hexId).then((todo) => {
          expect(todo).to.be.null;
          done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if todo not found', (done) => {
    const hexId = new ObjectID("6adde5b432c9a80b1e9bde1d");
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .expect((res) => {
      // Response attribute should be an empty body
      expect(res.body).to.be.empty;
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      // No change in database should be there
      Todo.find().then((docs) => {
        expect(docs.length).to.be.equal(2);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 400 if object is invalid', (done) => {
    request(app)
    .delete(`/todos/123abc`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(400)
    .expect((res) => {
      // Check for response attributes
      expect(res.body).to.be.empty;
    })
    .end((err, res) => {
        if(err) {
          return done(err);
        }
        // Check for database changes
        Todo.find().then((docs) => {
          expect(docs.length).to.be.equal(2);
          done()
        }).catch((e) => done(e));
    });
  });

});

describe('PATCH /todos/:id', () => {
    it('should return a patched todo', (done) => {
      const hexId = todos[0]._id.toHexString();
      const newTodo = {
        'text': 'Patched Text',
        'completed': true
      }
      request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(newTodo)
      .expect(200)
      .expect((res) => {
        // Testing attributes of response
        expect(res.body.todo._creator).to.be.equal(users[0]._id.toHexString());
        expect(res.body.todo._id).to.be.equal(hexId);
        expect(res.body.todo.text).to.be.equal(newTodo.text);
        expect(res.body.todo.completed).to.be.equal(newTodo.completed);
        if (newTodo.completed) {
          expect(res.body.todo.completedAt).to.not.be.null;
        } else {
          expect(res.body.todo.completedAt).to.be.null;
        }
      })
      .end((err, res) => {
          if(err) {
            return done(err);
          }
          // Testing changes in database
          Todo.find().then((todos) => {
            expect(todos.length).to.be.equal(2);
            done();
          }).catch((e) => done(e));
      });
    });

    it('should return a 404 for a not found object', (done) => {
      const hexId = new ObjectID("6adde5b432c9a80b1e9bde1d");
      const newTodo = {
        'text': 'Patched Text',
        'completed': true
      }
      request(app)
      .patch(`/todos/${hexId.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect((res) => {
        //Response attributes
        expect(res.body).to.be.empty;
      })
      .end((err, res) => {
        if(err) { return done(err); }
        // Changes in database
        Todo.findById(hexId).then((doc) => {
          expect(doc).to.be.null;
          return Todo.find();
        }).then((docs) => {
          expect(docs.length).to.be.equal(2);
          done();
        }).catch((e) => done(e));

      });
    });

    it('should return a 400 for invalid object', (done) => {
      const newTodo = {
        'text': 'Patched Text',
        'completed': true
      }
      request(app)
      .patch(`/todos/123abc}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .expect((res) => {
        //Response attributes
        expect(res.body).to.be.empty;
      })
      .end((err, res) => {
        if(err) { return done(err); }
        // Changes in database - Check for nitems
        Todo.find()
        .then((docs) => {
          expect(docs.length).to.be.equal(2);
          done();
        }).catch((e) => done(e));
      });
    });
});

describe('POST /users', () => {
  it('should create a new user', (done) => {
    var name = "Sample Name";
    var age = 25;
    var email = "abc@example.com";
    var password = "validpassword";
    request(app)
    .post('/users')
    .send({name,age,email,password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).to.not.be.null;
      expect(res.body._id).to.not.be.null;
      expect(res.body.name).to.be.equal(name);
      expect(res.body.age).to.be.equal(age);
      expect(res.body.email).to.be.equal(email);
    })
    .end((err, res) => {
      if(err) { done(err); }

      // Find by email since email is unique
      User.findOne({email}).then((user) => {
        expect(user).to.not.be.null;
        expect(user.password).to.not.equal(password);
        done();
      })

    });
  });

  // Test with wrong email or password format
  it('should not create a user with invalid credentials', (done) => {
    var name = "Sample Name";
    var age = 25;
    var email = "abcample.com";
    var password = "wronasg";

    request(app)
    .post('/users')
    .send({name,age,email,password})
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.empty;
    })
    .end(done);
  });

  it('should not create a user if email already exists', (done) => {
    var name = "Sample Name";
    var age = 25;
    var email = users[0];
    var password = "wronasg";

    request(app)
    .post('/users')
    .send({name, age, email, password})
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.empty;
    })
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should return user if credentials are valid', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).to.not.be.null;
      expect(res.body._id).to.not.be.null;
      expect(res.body._id).to.equal(users[1]._id.toHexString());
      expect(res.body.name).to.be.equal(users[1].name);
      expect(res.body.email).to.be.equal(users[1].email);
      expect(res.body.age).to.be.equal(users[1].age);
    })
    .end(done)
  });

  it('should return 400 if credentials not valid', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: "invalid"})
    .expect(400)
    .expect((res) => {
      expect(res.body).to.be.empty;
    })
    .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if auth is valid', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).to.not.be.null;
      expect(res.body._id).to.equal(users[0]._id.toHexString());
      expect(res.body.name).to.be.equal(users[0].name);
      expect(res.body.email).to.be.equal(users[0].email);
      expect(res.body.age).to.be.equal(users[0].age);
    })
    .end(done)
  });

  it('should return 401 if auth token not valid', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', 'gibberish')
    .expect(401)
    .expect((res) => {
      expect(res.body).to.be.empty;
    })
    .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete the token for logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .send()
    .expect(200)
    .end((err, res) => {
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens).to.be.empty;
        done();
      });
    });
  });
});
