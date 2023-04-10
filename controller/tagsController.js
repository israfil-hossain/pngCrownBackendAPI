const Tags = require("../models/TagSchema");

// Add Tags
const addTags = async (req, res) => {
    let newTags ; 
    newTags = new Tags({
        ...req.body
    })
    try{
        const tagsItem = await newTags.save(); 
        res.status(200).json({
            message:"Tags  Add Successfully !",
            tagsItem
        })
    } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown Error Occured ",
        },
      },
    });
  }
};

// Get All Tags
const getTags = async (req, res, next) => {
  try {
    const tagsItem = await Tags.find();
    res.json(tagsItem);
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: `Unknown error occured ! ${err}`,
        },
      },
    });
  }
};

module.exports = {
  addTags,
  getTags,
};
