// const People = require("../models/People");
// const ImageDatas = require("../models/imageSchema");
// const Categories = require("../models/CategorySchema");
// const Sliders = require("../models/SliderSchema");
// const DownloadModel = require("../models/DownloadSchema");

// const getAllData = async (req, res) => {
//   try {
//     const pipeline = [
//       {
//         $group: {
//           _id: null,
//           totalImages: { $sum: 1 },
//           downloadCounts: { $sum: "$downloadCount"}
//         },
//       },
//     ];

//     const imageCount = await ImageDatas.aggregate(pipeline);
//     const categoryCount = await Categories.countDocuments({});
//     const userCount = await People.countDocuments({});
//     const sliderCount = await Sliders.countDocuments({});
//     const downloadCount = await DownloadModel.aggregate(pipeline);

//     res.json({
//       totalImages: imageCount[0].totalImages,
//       totalCategories: categoryCount,
//       totalUserDatas: userCount,
//       totalSliderDatas : sliderCount,
//       totalDownloads: downloadCount[0].totalDownloads
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// module.exports = {
//   getAllData,
// };


const People = require("../models/People");
const ImageDatas = require("../models/imageSchema");
const Categories = require("../models/CategorySchema");
const Sliders = require("../models/SliderSchema");
const DownloadModel = require("../models/DownloadSchema");

const getAllData = async (req, res) => {
  try {
    const imageCountPipeline = [{ $group: { _id: null, totalImages: { $sum: 1 } } }];
    const imageCount = await ImageDatas.aggregate(imageCountPipeline);

    const categoryCount = await Categories.countDocuments({});
    const userCount = await People.countDocuments({});
    const sliderCount = await Sliders.countDocuments({});

    const downloadCountPipeline = [{ $group: { _id: null, totalDownloads: { $sum: "$downloadCount" } } }];
    const downloadCount = await DownloadModel.aggregate(downloadCountPipeline);

    res.json({
      totalImages: imageCount[0].totalImages,
      totalCategories: categoryCount,
      totalUserDatas: userCount,
      totalSliderDatas: sliderCount,
      totalDownloads: downloadCount[0].totalDownloads || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllData,
};
