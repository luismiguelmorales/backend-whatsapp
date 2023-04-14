const Message = require('../models/message');
const User = require('../models/user');
const io = require('../socket');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


exports.getMessages = (req, res, next) => {
  console.log('****************************');
  console.log(JSON.stringify(req.body));
  console.log('+++++++++++++++++++++++++++');
  let senderId = req.body.senderId || null;
  let receiverId = req.body.receiverId || null;
  
  User.findOne({ _id: senderId })
  .then(user => {
    if (user) {
      senderId = user._id;
    } else {
      senderId = null;
    }
  })
  .catch(err => {
    senderId = null;
    console.log(err);
  });
  
  User.findOne({ _id: receiverId })
  .then(user => {
    if (user) {
      receiverId = user._id;
    } else {
      receiverId = null;
    }
  })
  .catch(err => {
    receiverId = null;
    console.log(err);
  });
  
  if (senderId != null && receiverId != null) {

    // Message.findAll({ where: { sender_id: userId_1, receiver_id: userId_2 } })
    Message.find({
      $or:[
        {
          // sender_id: new Schema.ObjectId(senderId),
          sender_id: senderId,
          // receiver_id: new Schema.ObjectId(receiverId),
          receiver_id: receiverId
        }, 
        { 
          // sender_id: new Schema.ObjectId(receiverId),
          sender_id: receiverId,
          // receiver_id: new Schema.ObjectId(senderId),
          receiver_id: senderId
        }
      ]
    })
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(err => {
      console.log(err);
    });
  } else {
    res.status(204).json([]);
  }
  
};

exports.postAddMessage = (req, res, next) => {
  console.log('req.body ->' + JSON.stringify(req.body));
  let msg = req.body.msg;
  let senderId = req.body.senderId;
  let receiverId = req.body.receiverId;

  Message.create({ message: msg, sender_id: senderId, receiver_id: receiverId })
  .then(result => {
      console.log("Message's auto-generated ID:", result.id);

      io.getIO().emit('messages', {
          action: 'create'
        });

      res.status(201).json(result);
  })
  .catch(err => {
      console.log(err);
  });
};




/*

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
*/