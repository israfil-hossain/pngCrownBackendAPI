const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
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
  link:{
    type:String,
  }
},{
  timestamps:true,
});

const Slider = mongoose.model('slider', sliderSchema);

module.exports = Slider;
