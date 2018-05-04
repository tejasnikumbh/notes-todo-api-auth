const mongoose = require('mongoose');
const validator = require('validator');

const {secret} = require('./../utils/keys');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// {
//   email: "abc@example.com",
//   password: "adadzasdsadsadsda"
//   tokens : [{ // array since we need different auth tokens for mobile and desktop
//     access: 'auth',
//     token: 'cryptographically secured string'
//   }]
// }
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 200
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator:  validator.isEmail,
      message: `{VALUE} is not a valid E-mail`
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
  }],
  profession: {
    type: String,
    default: null
  }
});

// Instance Methods

UserSchema.methods.toJSON = function () {
  var user = this;
  return _.pick(user, ['_id', 'name', 'age', 'email', 'profession']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var data = {
      _id: user._id.toHexString(),
      access
    };

    var token = jwt.sign(data, secret).toString();
    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull:{
      tokens:{token}
    }
  });
}

UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
     _id: decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if(!user) { return Promise.reject()}
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}

UserSchema.pre('save', function (next) {
  var user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})

const User = mongoose.model('User', UserSchema);

module.exports = {User};
