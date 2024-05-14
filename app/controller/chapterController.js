/* eslint-disable consistent-return */
const ApiError = require('../../utils/apiError');
const { Chapter, Course } = require('../models');
require('dotenv').config();

const createChapter = async (req, res, next) => {
  const { chapterTitle } = req.body;
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) return next(new ApiError('Data course tidak ditemukan', 404));

    if (!chapterTitle) { return next(new ApiError('Judul chapter harus diisi', 400)); }

    const chapter = await Chapter.create({
      chapterTitle,
      courseId: course.id,
    });

    res.status(201).json({
      status: 'Sukses',
      data: {
        chapter,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const findAllChapter = async (req, res, next) => {
  try {
    const chapters = await Chapter.findAll({
      include: ['contents', 'Course'],
    });

    res.status(200).json({
      status: 'Sukses',
      message: 'Sukses menambahkan data',
      data: {
        chapters,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const findChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findOne({
      where: {
        id: req.params.id,
      },
      include: ['contents', 'Course'],
    });

    if (!chapter) return next(new ApiError('Data chapter tidak ditemukan', 404));

    res.status(200).json({
      status: 'Sukses',
      data: {
        chapter,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const updateChapter = async (req, res, next) => {
  try {
    const { chapterTitle } = req.body;

    const chapterId = await Chapter.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!chapterId) { return next(new ApiError('Data chapter tidak ditemukan'), 404); }

    if (!chapterTitle) { return next(new ApiError('Judul chapter harus diisi', 400)); }

    const chapter = await Chapter.update(
      {
        chapterTitle,
      },
      {
        where: {
          id: req.params.id,
        },
        returning: true,
      },
    );

    res.status(200).json({
      status: 'Sukses',
      message: 'Sukses memperbarui data',
      data: chapter[1],
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const deleteChapter = async (req, res, next) => {
  try {
    const chapterId = await Chapter.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!chapterId) { return next(new ApiError('Data chapter tidak ditemukan'), 404); }

    await Chapter.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({
      status: 'Sukses',
      message: 'Sukses menghapus data',
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  createChapter,
  findAllChapter,
  findChapter,
  updateChapter,
  deleteChapter,
};
