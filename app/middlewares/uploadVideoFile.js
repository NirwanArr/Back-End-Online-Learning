const multer = require('multer');
const ApiError = require('../../utils/apiError');

const videoFileFiltering = (res, file, cb) => {
  if (file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv') {
    cb(null, true);
  } else {
    return cb(new ApiError('Video format must be mp4 and mkv', 400));
  }
};

// const VideoStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './public/video/');
//   },

//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

const upload = multer({
  fileFilter: videoFileFiltering,
  // storage: VideoStorage,
});

module.exports = upload;
