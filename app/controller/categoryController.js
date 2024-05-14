const path = require('path');
const { Category } = require('../models');
const ApiError = require('../../utils/apiError');
const imagekit = require('../libs/imagekit');

const getAllCategory = async (req, res, next) => {
  try {
    const category = await Category.findAll({
      include: ['Courses'],
    });

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getOneCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: ['Courses'],
    });

    res.status(200).json({
      status: 'success',
      data: category,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const createCategory = async (req, res, next) => {
  const categoryBody = req.body;
  const { file } = req;
  let image;

  try {
    if (file) {
      const filename = file.originalname;
      const extension = path.extname(filename);
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      image = uploadedImage.url;
    }

    const newCategory = await Category.create({ ...categoryBody, image });

    res.status(201).json({
      status: 'success',
      data: newCategory,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const categoryBody = req.body;
  const { file } = req;
  const condition = { where: { id }, returning: true };
  let image;

  try {
    if (file) {
      const filename = file.originalname;
      const extension = path.extname(filename);
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      image = uploadedImage.url;
    }

    const updatedCategory = await Category.update(
      { ...categoryBody, image },
      condition,
    );

    res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui kategori dengan ID ${id}`,
      data: updatedCategory[1],
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const condition = { where: { id } };
  try {
    await Category.destroy(condition);

    res.status(201).json({
      status: 'success',
      message: `Berhasil menghapus kategori dengan ID ${id}`,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
