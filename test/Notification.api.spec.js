/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

describe('API Get All Notifikasi', () => {
  it('Success get all notifikasi', async () => {
    const response = await request(app).get('/api/v1/notification/getAllNotif');
    expect(response.statusCode).toBe(200);
  });
});

describe('API Get Notification by UserId', () => {
  it('Success get notificaition', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;

    const response = await request(app)
      .get('/api/v1/notification/getNotifByUserId')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
  it('Failed get notificaition when user not login', async () => {
    const response = await request(app).get(
      '/api/v1/notification/getNotifByUserId',
    );
    expect(response.statusCode).toBe(401);
  });
});

describe('API Get Notification User by notif id', () => {
  it('Success get notificaition', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;

    const notifId = 1;

    const response = await request(app)
      .get(`/api/v1/notification/getDetailNotif/${notifId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });
  it('Failed get notificaition when id not found', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: process.env.PASSWORD_HASH,
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;

    const notifId = 9999;

    const response = await request(app)
      .get(`/api/v1/notification/getDetailNotif/${notifId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
  });
  it('Failed get notificaition when user not login', async () => {
    const response = await request(app).get(
      '/api/v1/notification/getNotifByUserId',
    );
    expect(response.statusCode).toBe(401);
  });
});
