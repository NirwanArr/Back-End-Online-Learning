/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

describe('API Get All Chapter', () => {
  it('Success get all chapter', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;

    const response = await request(app)
      .get('/api/v1/chapter/')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('API Get One Chapter', () => {
  it('Success get one chapter', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idChapter = 10;

    const response = await request(app)
      .get(`/api/v1/chapter/${idChapter}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});

describe('API Create Chapter', () => {
  it('Success create chapter', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idCourse = 1;
    const newChapter = {
      chapterTitle: 'Pengenalan database',
    };
    const response = await request(app)
      .post(`/api/v1/chapter/create/${idCourse}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newChapter);
    expect(response.statusCode).toBe(201);
  }, 10000);

  it('Failed if id course not found', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idCourse = 999;
    const newChapter = {
      chapterTitle: 'Pengenalan database',
    };
    const response = await request(app)
      .post(`/api/v1/chapter/create/${idCourse}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newChapter);
    expect(response.statusCode).toBe(404);
  }, 10000);

  it('Failed if field not required', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idCourse = 1;
    const newChapter = {};
    const response = await request(app)
      .post(`/api/v1/chapter/create/${idCourse}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newChapter);
    expect(response.statusCode).toBe(400);
  }, 10000);
});

describe('API Update Chapter', () => {
  it('Success update chapter', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idChapter = 1;
    const newChapter = {
      chapterTitle: 'Pengenalan database baru',
    };

    const response = await request(app)
      .put(`/api/v1/chapter/update/${idChapter}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newChapter);
    expect(response.statusCode).toBe(200);
  }, 10000);
});

describe('API Delete Chapter', () => {
  it('Success delete chapter', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;

    const newChapter = {
      chapterTitle: 'Pengenalan database',
    };
    const addChapter = await request(app)
      .post('/api/v1/chapter/create/1')
      .set('Authorization', `Bearer ${token}`)
      .send(newChapter);

    const idChapter = addChapter.body.data.chapter.id;
    const response = await request(app)
      .delete(`/api/v1/chapter/delete/${idChapter}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
});
