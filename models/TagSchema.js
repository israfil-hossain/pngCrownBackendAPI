const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  
  tagsitem:{
    type:String,
  },
});

const Tags = mongoose.model('tags', tagsSchema);

module.exports = Tags;
