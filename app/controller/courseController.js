/* eslint-disable consistent-return */
const { Op } = require('sequelize');
const path = require('path');
const {
  Course,
  Chapter,
  Content,
  Category,
  User,
  CourseUser,
  Sequelize,
} = require('../models');
const ApiError = require('../../utils/apiError');
const imagekit = require('../libs/imagekit');

const getAllCourse = async (req, res, next) => {
  try {
    const {
      search,
      category,
      level,
      type,
      sort_by: sortBy,
      order_by: orderBy,
    } = req.query;

    const filter = {};
    const order = [];

    if (search) {
      filter.courseName = { [Op.iLike]: `%${search}%` };
    }

    if (category) {
      filter.categoryId = { [Op.or]: JSON.parse(category) };
    }

    if (type) {
      const types = ['Free', 'Premium'];
      if (!types.includes(type)) {
        return next(new ApiError('tipe kursus tidak valid', 400));
      }
      filter.courseType = type;
    }

    if (level) {
      const levels = ['Beginner', 'Intermediate', 'Advanced'];
      if (!levels.includes(level)) {
        return next(new ApiError('level tidak valid', 400));
      }
      filter.courseLevel = level;
    }

    if (sortBy && !orderBy) {
      return next(new ApiError('query parameter orderBy tidak boleh kosong', 400));
    }

    if (!sortBy && orderBy) {
      return next(new ApiError('query parameter sortBy tidak boleh kosong', 400));
    }

    if (sortBy && orderBy) {
      if (!['asc', 'desc'].includes(orderBy.toLowerCase())) {
        return next(new ApiError('tolong isi query parameter orderBy dengan asc atau desc', 400));
      }
      order.push([sortBy, orderBy.toUpperCase()]);
    }

    const getCourses = await Course.findAll({
      where: { ...filter },
      attributes: {
        exclude: ['aboutCourse', 'intendedFor', 'telegramGroup'],
      },
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'courseBy' },
        {
          model: Chapter,
          as: 'chapters',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: Content,
              as: 'contents',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
      order,
    });

    if (!getCourses) {
      return next(new ApiError('Kursus kosong', 404));
    }

    const mapCourse = Promise.all(
      getCourses.map(async (course) => {
        const chaptersByCourseId = course.toJSON().chapters;
        const contents = chaptersByCourseId.map((chapter) => {
          const contentPerChapters = chapter.contents.map((content) => content);
          return contentPerChapters;
        });

        const totalDurationPerChapter = contents.map((content) => {
          const sumDuration = content.reduce((acc, curr) => {
            const duration = curr.duration.split(':');
            const minutes = parseInt(duration[0], 10);
            const second = duration[1] !== '00' ? parseFloat(duration[1] / 60) : 0;
            const total = acc + minutes + second;
            return total;
          }, 0);
          return sumDuration;
        });

        const totalDurationPerCourse = totalDurationPerChapter.reduce((acc, curr) => acc + curr, 0);

        const modulePerCourse = await Chapter.count({
          where: {
            courseId: course.id,
          },
        });

        const isDiscount = course.courseDiscountInPercent > 0;
        const rawPrice = course.coursePrice / (1 - course.courseDiscountInPercent / 100);

        return {
          ...course.toJSON(),
          courseBy: course.courseBy.name,
          category: course.category.categoryName,
          rawPrice,
          durationPerCourseInMinutes: Math.round(totalDurationPerCourse),
          isDiscount,
          modulePerCourse,
        };
      }),
    );

    const formatedCourses = await mapCourse;
    const courses = formatedCourses.map((course) => {
      const courseItem = course;
      delete courseItem.chapters;
      return course;
    });

    res.status(200).json({
      status: 'success',
      data: courses,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const getOneCourse = async (req, res, next) => {
  try {
    const isCourseEnrolled = await CourseUser.findOne({
      where: { courseId: req.params.id, userId: req.user.id },
    });

    const getCourse = await Course.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'courseBy' },
        {
          model: Chapter,
          as: 'chapters',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          include: [
            {
              model: Content,
              as: 'contents',
              attributes: {
                exclude: ['createdAt', 'updatedAt'],
              },
            },
          ],
        },
      ],
    });

    const course = getCourse.toJSON();

    const modulePerCourse = await Chapter.count({
      where: {
        courseId: req.params.id,
      },
    });

    const contentIndex = course.chapters.flatMap((chapter) => {
      const contentId = chapter.contents.map((content) => content.id);
      return contentId;
    });

    const getChapterDuration = Promise.all(
      course.chapters.map(async (chapter) => {
        const contents = await Content.findAll({
          where: { chapterId: chapter.id },
          raw: true,
        });
        const totalDuration = contents.reduce((acc, curr) => {
          const duration = curr.duration.split(':');
          const minutes = parseInt(duration[0], 10);
          const seconds = parseFloat(duration[1] / 60);
          const total = acc + minutes + seconds;
          return total;
        }, 0);
        return totalDuration;
      }),
    );
    const chapterDuration = await getChapterDuration;

    const totalCourseDuration = chapterDuration.reduce((acc, curr) => acc + curr, 0);

    const resChapter = course.chapters.map((chapter, i) => {
      const chapters = chapter;
      chapters.contents = chapter.contents.map((content) => {
        const contents = content;
        contents.isLocked = false;
        contents.isWatched = false;
        if (isCourseEnrolled && content.id < contentIndex[isCourseEnrolled.contentFinished]) {
          contents.isWatched = true;
        }
        if (
          (!isCourseEnrolled && content.id >= contentIndex[1])
          || (isCourseEnrolled && content.id > contentIndex[isCourseEnrolled.contentFinished])
        ) {
          contents.isLocked = true;
          contents.message = !isCourseEnrolled
            ? 'Silahkan tambahkan ke kelas berjalan untuk bisa mengakses semua video'
            : 'Silahkan tonton video sebelumnya, untuk mengakses video selanjutnya';
        }
        return content;
      });

      return {
        ...chapters,
        contents: chapter.contents,
        durationPerChapterInMinutes: Math.round(chapterDuration[i]),
      };
    });

    const rawPrice = course.coursePrice / (1 - course.courseDiscountInPercent / 100);

    if (isCourseEnrolled) {
      course.courseUserId = isCourseEnrolled.id;
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...course,
        courseBy: course.courseBy.name,
        category: course.category.categoryName,
        chapters: resChapter,
        rawPrice,
        modulePerCourse,
        durationPerCourseInMinutes: Math.round(totalCourseDuration),
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

const createCourse = async (req, res, next) => {
  const { file, body: courseBody } = req;
  let image;

  try {
    if (file) {
      const fileSize = req.headers['content-length'];

      if (fileSize > 10000000) {
        return next(new ApiError('Ukuran gambar kursus tidak boleh lebih dari 10mb', 413));
      }

      const filename = file.originalname;
      const extension = path.extname(filename);
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      image = uploadedImage.url;
    }

    const { coursePrice, courseDiscountInPercent, isDiscount } = courseBody;

    if (courseDiscountInPercent) {
      courseBody.coursePrice = coursePrice - (coursePrice * courseDiscountInPercent) / 100;
    }

    const newCourse = await Course.create({
      ...courseBody,
      userId: req.user.id,
      image,
    });

    res.status(201).json({
      status: 'success',
      data: { ...newCourse.toJSON(), isDiscount, rawCoursePrice: coursePrice },
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      const field = err.errors[0].path;
      return next(new ApiError(`${field} tidak boleh kosong`, 400));
    }
    next(new ApiError(err.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  const { id } = req.params;
  const { file, body: courseBody } = req;
  const condition = { where: { id }, returning: true };
  let image;

  try {
    Object.entries(courseBody).forEach((key) => {
      if (!courseBody[key[0]]) {
        delete courseBody[key[0]];
      }
    });

    if (courseBody.categoryId) {
      const isCategoryExists = await Category.findByPk(courseBody.categoryId);
      if (!isCategoryExists) {
        return next(new ApiError('Kategori tidak ditemukan', 404));
      }
    }

    if (file) {
      const fileSize = req.headers['content-length'];

      if (fileSize > 10000000) {
        return next(new ApiError('Ukuran gambar kursus tidak boleh lebih dari 10mb', 413));
      }

      const filename = file.originalname;
      const extension = path.extname(filename);
      const uploadedImage = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });
      image = uploadedImage.url;
    }

    const { coursePrice, isDiscount, courseDiscountInPercent } = courseBody;

    if (courseDiscountInPercent) {
      courseBody.coursePrice = coursePrice - (coursePrice * courseDiscountInPercent) / 100;
    }

    const updatedCourse = await Course.update({
      ...courseBody, userId: req.user.id, image,
    }, condition);

    res.status(200).json({
      status: 'success',
      message: `Berhasil memperbarui data kursus dengan id ${id}`,
      data: { ...updatedCourse[1][0].toJSON(), isDiscount, rawPrice: coursePrice },
    });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      const field = err.errors[0].path;
      return next(new ApiError(`${field} tidak boleh kosong`, 400));
    }
    next(new ApiError(err.message, 500));
  }
};

const deleteCourse = async (req, res, next) => {
  const { id } = req.params;
  const condition = { where: { id } };
  try {
    const chapters = await Chapter.findAll({
      where: {
        courseId: id,
      },
      include: [
        {
          model: Content,
          as: 'contents',
        },
      ],
    });

    Promise.all(
      chapters.flatMap(async (chapter) => {
        await Content.destroy({ where: { chapterId: chapter.id } });
      }),
    );
    await CourseUser.destroy({ where: { courseId: id } });
    await Chapter.destroy({ where: { courseId: id } });
    await Course.destroy(condition);

    res.status(200).json({
      status: 'success',
      message: `Berhasil menghapus course dengan id ${id}`,
    });
  } catch (err) {
    next(new ApiError(err.message, 500));
  }
};

module.exports = {
  getAllCourse,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
