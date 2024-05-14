const { Content, Chapter } = require('../models');
const ApiError = require('../../utils/apiError');
// const compressVideo = require('../../helper/compressVideo')
// const imagekit = require('../libs/imagekit')

const getContent = async (req, res, next) => {
  try {
    const dataContent = await Content.findAll({
      include: Chapter,
    });

    if (dataContent.length < 1) {
      return next(new ApiError('Konten data kosong', 404));
    }

    res.status(200).json({
      status: 'Success',
      message: 'Konten data berhasil ditampilkan',
      dataContent,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getContentByid = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const dataContent = await Content.findOne({
      where: {
        id: contentId,
      },
      include: Chapter,
    });

    if (dataContent === null) {
      return next(
        new ApiError(`Data konten dengan id: ${contentId} kosong`, 404),
      );
    }

    res.status(200).json({
      status: 'Success',
      message: 'Konten data berhasil ditampilkan',
      dataContent,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const insertContentByLink = async (req, res, next) => {
  try {
    const { contentTitle, contentUrl, videoDuration } = req.body;
    const { chapterId } = req.params;

    const dataContent = await Content.create({
      chapterId,
      contentTitle,

      contentUrl,
      youtubeId: contentUrl.match(/youtu\.be\/([^?]+)/)[1],
      duration: videoDuration,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Sukses menambahkan data konten',
      dataContent,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

// const insertContentByFile = async (req, res, next) => {
//   try {
//     const { status, contentTitle } = req.body;
//     const { chapterId } = req.params;
//     const videoBuffer = req.file.buffer;
//     const video = req.file;

//     const chapterData = await Chapter.findOne({
//       where: {
//         id: chapterId,
//       },
//     });

//     if (chapterData === null) {
//       return next(new ApiError('Data chapter tidak ditemukan!', 404));
//     }

//     const timeScale = videoBuffer.readUInt32BE(
//       videoBuffer.indexOf(Buffer.from('mvhd')) + 16,
//     );
//     const duration = videoBuffer.readUInt32BE(
//       videoBuffer.indexOf(Buffer.from('mvhd')) + 16 + 4,
//     );
//     const seconds = Math.floor(duration / timeScale);
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.round(seconds % 60);

//     const videoDuration = `${minutes}:${remainingSeconds}`;

//     const split = video.originalname.split('.');

//     let videoTitle;
//     if (!contentTitle) {
//       videoTitle = split[0];
//     } else {
//       videoTitle = contentTitle;
//     }

//     const resizeVideo = compressVideo(video, 14155776);

//     const uploadVideo = await imagekit.upload({
//       file: resizeVideo.buffer,
//       fileName: videoTitle,
//     });

//     const dataContent = await Content.create({
//       status,
//       chapterId,
//       contentTitle: videoTitle,
//       contentUrl: uploadVideo.url,
//       duration: videoDuration,
//     });

//     res.status(200).json({
//       status: 'Success',
//       message: 'Data konten berhasil ditambah',
//       data: {
//         dataContent,
//       },
//     });
//   } catch (err) {
//     next(new ApiError(err.message, 500));
//   }
// };

// const updateContentByFile = async (req, res, next) => {
//   try {
//     const { chapterId, contentId } = req.params;
//     const video = req.file;
//     const { contentTitle } = req.body;

//     // const chapterData = await Chapter.findOne({
//     //   where: {
//     //     id: chapterId,
//     //   },
//     // });

//     const contentData = await Content.findOne({
//       where: {
//         id: contentId,
//       },
//     });

//     // if (chapterData === null) {
//     //   return next(new ApiError('Chapter data is not found!', 400));
//     // }
//     if (contentData === null) {
//       return next(new ApiError('Data konten tidak ditemukan!', 404));
//     }

//     if (contentData.dataValues.contentUrl.split('/')[2] === 'ik.imagekit.io') {
//       let updateContent;
//       if (video) {
//         const resizeVideo = compressVideo(video, 14155776);
//         const split = video.originalname.split('.');
//         const videoTitle = split[0];
//         const uploadVideo = await imagekit.upload({
//           file: resizeVideo.buffer,
//           fileName: videoTitle,
//         });
//         updateContent = await Content.update(
//           {
//             contentTitle,
//             contentUrl: uploadVideo.url,
//           },
//           {
//             where: {
//               chapterId,
//               id: contentId,
//             },
//             returning: true,
//           },
//         );
//       } else if (contentTitle) {
//         const urlParts = contentData.dataValues.contentUrl.split('/');
//         const getName = urlParts[urlParts.length - 1].split(' ').join('_');
//         urlParts[urlParts.length - 1] = contentTitle.split(' ').join('_');
//         const updateVideoUrl = urlParts.join('/');
//         await imagekit.renameFile({
//           filePath: getName,
//           newFileName: contentTitle,
//           purgeCache: false,
//         });
//         updateContent = await Content.update(
//           {
//             contentTitle,
//             contentUrl: updateVideoUrl,
//           },
//           {
//             where: {
//               chapterId,
//               id: contentId,
//             },
//             returning: true,
//           },
//         );
//       } else if (contentTitle && video) {
//         const resizeVideo = compressVideo(video, 14155776);
//         const split = video.originalname.split('.');
//         const videoTitle = split[0];
//         const uploadVideo = await imagekit.upload({
//           file: resizeVideo.buffer,
//           fileName: videoTitle,
//         });
//         await Content.update(
//           {
//             contentTitle,
//             contentUrl: uploadVideo.url,
//           },
//           {
//             where: {
//               chapterId,
//               id: contentId,
//             },
//             returning: true,
//           },
//         );
//         const urlParts = contentData.dataValues.contentUrl.split('/');
//         const getName = urlParts[urlParts.length - 1].split(' ').join('_');
//         urlParts[urlParts.length - 1] = contentTitle.split(' ').join('_');
//         const updateVideoUrl = urlParts.join('/');
//         await imagekit.renameFile({
//           filePath: getName,
//           newFileName: contentTitle,
//           purgeCache: false,
//         });
//         updateContent = await Content.update(
//           {
//             contentTitle,
//             contentUrl: updateVideoUrl,
//           },
//           {
//             where: {
//               chapterId,
//               id: contentId,
//             },
//             returning: true,
//           },
//         );
//       }

//       res.status(200).json({
//         status: 'Success',
//         message: 'Berhasil update data konten',
//         data: {
//           updateContent: {
//             updateContent,
//           },
//         },
//       });
//     } else {
//       return next(
//         new ApiError(`Video with id: ${contentId} not a Imagekit link`, 403),
//       );
//     }
//   } catch (err) {
//     next(new ApiError(err.message, 500));
//   }
// };

const updateContentByLink = async (req, res, next) => {
  try {
    const { chapterId, contentId } = req.params;
    const { contentTitle, contentUrl, videoDuration } = req.body;

    // const chapterData = await Chapter.findOne({
    //   where: {
    //     id: chapterId,
    //   },
    // });

    const contentData = await Content.findOne({
      where: {
        id: contentId,
      },
    });

    // if (chapterData === null) {
    //   return next(new ApiError('Chapter data is not found!', 400));
    // }
    if (contentData === null) {
      return next(new ApiError('Data konten tidak ditemukan!', 404));
    }

    const updateContent = await Content.update(
      {
        contentTitle,
        contentUrl,
        duration: videoDuration,
      },
      {
        where: {
          chapterId,
          id: contentId,
        },
        returning: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: updateContent[1],
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const deleteContentByid = async (req, res, next) => {
  try {
    const { contentId } = req.params;
    const contentData = await Content.findOne({
      where: {
        id: contentId,
      },
    });

    if (contentData === null) {
      return next(new ApiError('Data konten tidak ditemukan!', 404));
    }

    const deletedContent = await Content.destroy({
      where: {
        id: contentId,
      },
      returning: true,
    });

    res.status(200).json({
      status: 'success',
      message: 'Sukses menghapus konten data',
      data: deletedContent,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};
module.exports = {
  getContent,
  getContentByid,
  insertContentByLink,
  // insertContentByFile,
  // updateContentByFile,
  updateContentByLink,
  deleteContentByid,
};
