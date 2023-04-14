const express = require('express');
const bodyParser = require('body-parser');

const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
// const flash = require('connect-flash');

const MONGODB_URI =
  'mongodb+srv://luis-mi:ARS4ever@cluster0.0vfk2hy.mongodb.net/?retryWrites=true&w=majority';
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
// const csrfProtection = csrf({ cookie: true });
// const cookieParser = require('cookie-parser'); // CSRF Cookie parsing
// app.use(cookieParser());

const User = require('./models/user');

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(
  session({
    secret: 'e3434vt',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// app.use(csrfProtection);
// app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});




app.use(/*csrfProtection, */authRoutes);

app.use(/*csrfProtection, */userRoutes);
app.use(/*csrfProtection, */messageRoutes);

mongoose.connect(MONGODB_URI)
  .then(result => {
    return app.listen(3000);
  })
  .then(server => {
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
    });
  })
  .catch(err => {
    console.log(err);
  });
