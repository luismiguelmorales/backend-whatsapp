const bcrypt = require('bcryptjs');

const User = require('../models/user');

/*
exports.getLogin = (req, res, next) => {
  let message = req.flash('error'); // <-
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
  
};
*/

/*
exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
  
};
*/


exports.postLogin = (req, res, next) => {
  console.log('exports.postLogin ----- START -----');
  console.log(req.session);
  console.log('exports.postLogin ----- END -----');
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // req.flash('error', 'Invalid email or password.');
        // return res.redirect('/login'); // <---------------------------------------------------------------
        return res.status(404).json({});
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.status(200).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
                /*localId: req.session._id,
                expiresIn: req.session.expires*/
              });
              // res.redirect('/'); // <---------------------------------------------------------------
            });
          }
          // req.flash('error', 'Invalid email or password.');
          // res.redirect('/login'); // <---------------------------------------------------------------
          res.status(401).json({});
        })
        .catch(err => {
          console.log(err);
          // res.redirect('/login'); // <---------------------------------------------------------------
          res.status(500).json({});
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
};


const admin = require("firebase-admin");
const serviceAccount = require("../chat-43931-firebase-adminsdk-gods5-8d47112100.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chat-43931-default-rtdb.firebaseio.com"
});
/*
app.post('/signup', async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const userResponse = await admin.auth().createUser({
    email: user.email,
    password: user.password,
    emailVerified: false,
    disabled: false    
  });
  res.json(userResponse);
});
*/
exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        // req.flash('error', 'E-Mail exists already, please pick a different one.');
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
          });
          return user.save();
        })
        .then(user => {
          return admin.auth().createUser({
            email: user.email,
            password: user.password,
            emailVerified: false,
            disabled: false    
          });
        })
        .then(userResponse => {
          res.status(200).json(userResponse);
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'Server internal error' });
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    // res.redirect('/'); // <---------------------------------------------------------------
  });
};
