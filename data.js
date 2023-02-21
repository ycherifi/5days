const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Structure du call JSON
const dataSchema = new Schema({
  keyword: String,
  items: [{
    name: String,
    description: String,
    link: String
  }]
});
//Export du model
const Data = mongoose.model('Data', dataSchema);

module.exports = Data;