const mongoose = require('mongoose');

const tagsSchema = new mongoose.Schema({
  
  tagsitem:{
    type:String,
  },
},{
  timestamps:true,
});

const Tags = mongoose.model('tags', tagsSchema);

module.exports = Tags;
