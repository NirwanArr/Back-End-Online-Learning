
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

const member = {
  email: 'memberc8@mail.com',
  password: process.env.PASSWORD_HASH,
};

const admin = {
  email: 'adminc8@mail.com',
  password: process.env.PASSWORD_HASH,
};

describe('API get all course user from current user login', () => {
  it('success get all current user login course user', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/course-user/my-course')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });

  it('failed get all current user login course user when courseStatus is not valid', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/course-user/my-course?status=completed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });

  it('failed get all current user login course user when user role is not member', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(admin);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/course-user/my-course?status=completed')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });

  it('failed get all current user login course user when user not login', async () => {
    const response = await request(app).get('/api/v1/course-user/my-course?status=completed');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
});

describe('API create one course user from current user login', () => {
  it('success create one course user', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course')
      .set('Authorization', `Bearer ${token}`);

    const course = courses.body.data[1];
    const { id } = course;

    const response = await request(app)
      .post(`/api/v1/course-user/create/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Success');
  });
  it('failed create one course user because user not login', async () => {
    const courses = await request(app).get('/api/v1/course');

    const course = courses.body.data.filter((course) => course.courseType === 'Premium')[0];

    const { id } = course;

    const response = await request(app).post(`/api/v1/course-user/create/${id}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create one course user because course user is premium and user not yet bought the course', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course')
      .set('Authorization', `Bearer ${token}`);

    const course = courses.body.data.filter((course) => course.courseType === 'Premium')[0];

    const { id } = course;

    const response = await request(app)
      .post(`/api/v1/course-user/create/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(402);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create one course user because already exist', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course')
      .set('Authorization', `Bearer ${token}`);

    const course = courses.body.data[1];
    const { id } = course;

    const response = await request(app)
      .post(`/api/v1/course-user/create/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create one course user because course not exist', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const response = await request(app)
      .post('/api/v1/course-user/create/9999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Failed');
  });
  it('failed create one course user because user role is not member', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(admin);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course')
      .set('Authorization', `Bearer ${token}`);

    const course = courses.body.data[0];
    const { id } = course;

    const response = await request(app)
      .post(`/api/v1/course-user/create/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
});

describe('API get one course user from current user login', () => {
  it('success get one course user', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const course = await request(app)
      .get('/api/v1/course-user/my-course')
      .set('Authorization', `Bearer ${token}`);

    const { id } = course.body.courses[0];

    const response = await request(app)
      .get(`/api/v1/course-user/my-course/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  });
  it('failed get one course user because user not login', async () => {
    const response = await request(app).get('/api/v1/course-user/my-course/99999999');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
  it('failed get one course user because user role not member', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(admin);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/course-user/my-course/99999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
  it('failed get one course user because course user not exists', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/course-user/my-course/99999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Failed');
  });
});
describe('API update one course user from current user login', () => {
  it('success update one course user', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course-user/my-course')
      .set('Authorization', `Bearer ${token}`);

    const coursesResponse = courses.body.courses[0];
    const { id: courseId } = coursesResponse;
    const course = await request(app)
      .get(`/api/v1/course-user/my-course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log(course.body.course);
    const { id } = course.body.course;
    const content = course.body.course.chapters[0].contents[0];
    const { id: contentId } = content;

    const response = await request(app)
      .patch(`/api/v1/course-user/update-progress/${id}/progress/${contentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    console.log(response.body);
    expect(response.body.status).toBe('success');
  });
  it('failed update one course user because user role not member', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(admin);
    const { token } = login.body.data;

    const response = await request(app)
      .patch('/api/v1/course-user/update-progress/1/progress/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });

  it('failed update one course user when content isLocked', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const courses = await request(app)
      .get('/api/v1/course-user/my-course')
      .set('Authorization', `Bearer ${token}`);

    const coursesResponse = courses.body.courses[0];

    const { id: courseId } = coursesResponse;

    const course = await request(app)
      .get(`/api/v1/course-user/my-course/${courseId}`)
      .set('Authorization', `Bearer ${token}`);

    const { id } = course.body.course;
    const content = course.body.course.chapters[1].contents[0];
    const { id: contentId } = content;

    const response = await request(app)
      .patch(`/api/v1/course-user/update-progress/${id}/progress/${contentId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('Failed');
  });
  it('failed update one course user when course user not exist', async () => {
    const login = await request(app).post('/api/v1/auth/member/login').send(member);
    const { token } = login.body.data;

    const response = await request(app)
      .patch('/api/v1/course-user/update-progress/99999999/progress/999999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('Failed');
  });

  it('failed get one course user because user not login', async () => {
    const response = await request(app).patch('/api/v1/course-user/update-progress/1/progress/1');

    expect(response.status).toBe(401);
    expect(response.body.status).toBe('Failed');
  });
});
