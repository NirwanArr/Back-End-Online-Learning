/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

describe('API get all course just', () => {
  it('success get all course', async () => {
    const response = await request(app).get('/api/v1/course');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('success filter course', async () => {
    const filters = {
      search: 'binar',
      category: [1],
      level: 'Beginner',
      type: 'Free',
      sort_by: 'createdAt',
      order_by: 'asc',
    };
    const response = await request(app).get('/api/v1/course').query(filters);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('failed filter course, when level and type course is invalid', async () => {
    const filters = {
      search: 'binar',
      category: [1],
      level: 'Master',
      type: 'Trial',
      sort_by: 'createdAt',
      order_by: 'asc',
    };
    const response = await request(app).get('/api/v1/course').query(filters);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('tipe kursus tidak valid');
  });

  it('failed sorting course, when order by is invalid value', async () => {
    const filters = {
      sort_by: 'createdAt',
      order_by: 'descending',
    };
    const response = await request(app).get('/api/v1/course').query(filters);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'tolong isi query parameter orderBy dengan asc atau desc',
    );
  });
});

describe('API create course', () => {
  it('success create course', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;

    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for beginner',
      courseType: 'Free',
      coursePrice: 0,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image:
        'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .post('/api/v1/course/create')
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  });
  it('failed create course, because user role not admin', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);

    const { token } = login.body.data;
    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for beginner',
      courseType: 'Free',
      coursePrice: 0,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image:
        'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .post('/api/v1/course/create')
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create course, when course price greater than 0 when course type is free', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for beginner',
      courseType: 'Free',
      coursePrice: 1000,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image:
        'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .post('/api/v1/course/create')
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create course, when mandatory field is empty', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const reqBody = {
      courseName: 'UI/UX course for Beginner',
      courseType: 'Free',
      rating: 9.5,
      telegramGroup: 'https://t.me/+yplueYmNDRZlZDNl',
      isDiscount: false,
      courseDiscountInPercent: 0,
      coursePrice: 0,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for Beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image: 'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .post('/api/v1/course/create')
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });
});

describe('API get one course', () => {
  it('success get one course', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[0];

    const response = await request(app)
      .get(`/api/v1/course/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('success');
  });
  it('failed because course not found', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;

    const response = await request(app)
      .get('/api/v1/course/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
  });
  it('failed get one course, because not login', async () => {
    const response = await request(app).get('/api/v1/course/1');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Anda harus masuk');
  });
});

describe('API update course', () => {
  it('success update course', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[0];

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for Beginner',
      courseType: 'Free',
      rating: 9.5,
      telegramGroup: 'https://t.me/+yplueYmNDRZlZDNl',
      isDiscount: false,
      courseDiscountInPercent: 0,
      coursePrice: 0,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for Beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image: 'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .patch(`/api/v1/course/update/${id}`)
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
  it('failed update course, because user role not admin', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);

    const { token } = login.body.data;
    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for Beginner',
      courseType: 'Free',
      rating: 9.5,
      telegramGroup: 'https://t.me/+yplueYmNDRZlZDNl',
      isDiscount: false,
      courseDiscountInPercent: 0,
      coursePrice: 0,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for Beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image: 'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };

    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[0];

    const response = await request(app)
      .patch(`/api/v1/course/update/${id}`)
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
  it('failed update course, when course price greater than 0 when course type is free', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const reqBody = {
      courseCode: 'uiux123',
      courseName: 'UI/UX course for Beginner',
      courseType: 'Free',
      rating: 9.5,
      telegramGroup: 'https://t.me/+yplueYmNDRZlZDNl',
      isDiscount: false,
      courseDiscountInPercent: 0,
      coursePrice: 1000,
      courseLevel: 'Beginner',
      aboutCourse: 'UI/UX course for Beginner',
      intendedFor: 'Untuk pemula yang ingin menjadi profesional',
      courseStatus: 'inProgress',
      categoryId: 1,
      image: 'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[0];

    const response = await request(app)
      .patch(`/api/v1/course/update/${id}`)
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });
});
describe('API delete course', () => {
  it('success delete course', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const login = await request(app).post('/api/v1/auth/admin/login').send(user);
    const token = login.body.data;

    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[6];

    const response = await request(app)
      .delete(`/api/v1/course/delete/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
  it('failed delete course, because course not found', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const login = await request(app).post('/api/v1/auth/admin/login').send(user);
    const token = login.body.data;

    const response = await request(app)
      .delete('/api/v1/course/delete/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Failed');
  });

  it('failed delete course, because user role is not admin', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const course = await request(app).get('/api/v1/course');
    const { id } = course.body.data[0];

    const response = await request(app)
      .delete(`/api/v1/course/delete/9999${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
});
