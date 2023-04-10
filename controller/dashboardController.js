const People = require("../models/People");
const ImageDatas = require("../models/imageSchema");
const Categories = require("../models/CategorySchema");
const Sliders = require("../models/SliderSchema")

const getAllData = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          totalImages: { $sum: 1 },
        },
      },
    ];

    const imageCount = await ImageDatas.aggregate(pipeline);
    const categoryCount = await Categories.countDocuments({});
    const userCount = await People.countDocuments({});
    const sliderCount = await Sliders.countDocuments({});

    res.json({
      totalImages: imageCount[0].totalImages,
      totalCategories: categoryCount,
      totalUserDatas: userCount,
      totalSliderDatas : sliderCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllData,
};
