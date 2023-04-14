/*
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  message: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sender_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  receiver_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

module.exports = Message;
*/


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiver_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
});

module.exports = mongoose.model('Message', messageSchema);



