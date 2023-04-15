const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({ // set _id field to ObjectId
    imageName: String,
    downloadCount: { type: Number, default: 0 } // set default download count to 0
});

const DownloadModel = mongoose.model('downloadImage', downloadSchema);

module.exports = DownloadModel;
