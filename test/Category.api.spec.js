/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

describe('API Get All Categories', () => {
  it('Success get all category', async () => {
    const response = await request(app)
      .get('/api/v1/category/');
    expect(response.statusCode).toBe(200);
  });
});

describe('API Get One category', () => {
  it('Success get one category', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idCategory = 1;
    const response = await request(app)
      .get(`/api/v1/category/${idCategory}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  }, 10000);
  it('Failed get category because id not found', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const token = login.body.data;
    const idCategory = 99999;
    const response = await request(app)
      .get(`/api/v1/category/${idCategory}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
  }, 10000);
});

describe('API Create category', () => {
  it('success create category', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const newCategory = {
      categoryName: 'Machine Learning',
      image:
        'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const response = await request(app)
      .post('/api/v1/category/create')
      .send(newCategory)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  }, 10000);
});

describe('API Update category', () => {
  it('success update category', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;
    const newCategory = {
      categoryName: 'UI/UX Design',

      image:
        'https://ik.imagekit.io/AliRajab03/IMG-1701735373080._AHX82eu7S.jpeg?updatedAt=1701735376494',
    };
    const response = await request(app)
      .patch('/api/v1/category/update/1')
      .send(newCategory)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
  }, 10000);
});

describe('API delete category', () => {
  it('success delete category', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const login = await request(app).post('/api/v1/auth/admin/login').send(user);

    const token = login.body.data;

    const reqBody = {
      categoryName: 'Machine Learning',

      image:
        'https://ik.imagekit.io/xphqqd3ms/IMG-1701252283386._e2FCryU2W.png?updatedAt=1701252300430',
    };
    const newCategory = await request(app)
      .post('/api/v1/category/create')
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    const idCategory = newCategory.body.data.id;

    const response = await request(app)
      .delete(`/api/v1/category/delete/${idCategory}`)
      .send(reqBody)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
  }, 10000);
});
