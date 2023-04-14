const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    console.log('getUsers -- start ----------');
  console.log(JSON.stringify(req.body));
  console.log('getUsers -- end ----------');
    User.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log(err);
    });
};
