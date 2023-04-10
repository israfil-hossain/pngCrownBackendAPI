const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  category:{
    type:String,
    required:[true, 'Please add a category'],
  },
  imageName:{
    type:String,
    required:[true, 'Please add a image name'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  public_id:{
    type:String,
  },
  tags:{
    type:[String],
  },
  format:{
    type:String,
  },
  width: {
    type:Number,
  },
  height: {
    type:Number,
  },
  size:{
    type:Number,
  }
});

const ImageModel = mongoose.model('imagedata', imageSchema);

module.exports = ImageModel;
