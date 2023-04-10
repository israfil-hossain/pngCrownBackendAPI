// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/uploads");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${Math.round(
//       Math.random() * 1e9
//     )}${path.extname(file.originalname)}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error("Only image files are allowed"));
//     }
//     cb(null, true);
//   },
//   limits:{
//     fileSize: 1024 * 1024,
//   },
// }).single("image");

// exports.upload = (req,res,next)=>{
//     upload(req,res,(err)=>{
//         if(err){
//             return res.status(400).json({error: err.message})
//         }
//         next();
//     });
// };