/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app/index');
require('dotenv').config();

describe('API Get All Users', () => {
  it('success get all users', async () => {
    const response = await request(app).get('/api/v1/user/');
    expect(response.statusCode).toBe(200);
  });
});

describe('API Get User By Email', () => {
  it('success get user by email', async () => {
    const userEmail = 'memberc8@mail.com';
    const response = await request(app).get(
      `/api/v1/user/get?email=${userEmail}`,
    );
    expect(response.statusCode).toBe(200);
  });

  it('failed get user by email because email not found', async () => {
    const userEmail = 'fsnefies@gmail.com';
    const response = await request(app).get(
      `/api/v1/user/get?email=${userEmail}`,
    );
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Pengguna tidak ditemukan');
  });
});

describe('API update user', () => {
  it('success update data user', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const { id } = login.body.data;
    const userUpdate = {
      name: 'MemberC8',
      phoneNumber: '085327436534',
      country: 'Malaisya',
      city: 'Johor',
    };
    const response = await request(app)
      .patch(`/api/v1/user/update/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate);
    expect(response.statusCode).toBe(200);
  });

  it('failed update data user because user not found', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const userUpdate = {
      name: 'Rajab',
      phoneNumber: '085327436534',
      country: 'Malaisya',
      city: 'Johor',
    };
    const response = await request(app)
      .patch('/api/v1/user/update/77')
      .set('Authorization', `Bearer ${token}`)
      .send(userUpdate);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Pengguna tidak ditemukan');
  });
});

describe('API delete user', () => {
  it('success delete data user', async () => {
    const userToRegister = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phoneNumber: '1234567890',
      country: 'USA',
      city: 'New York',
    };

    const registerResponse = await request(app)
      .post('/api/v1/auth/member/register')
      .send(userToRegister);

    const userIdToDelete = registerResponse.body.data.dataValues.id;

    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const check = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const res = JSON.parse(check.text);
    const token = res.data;

    const response = await request(app)
      .delete(`/api/v1/user/delete/${userIdToDelete}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Berhasil dihapus');
  });

  it('failed delete user because id not found', async () => {
    const admin = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const check = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(admin);
    const res = JSON.parse(check.text);
    const token = res.data;
    const response = await request(app)
      .delete('/api/v1/user/delete/9999')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('Pengguna dengan Id ini tidak ditemukan');
  });
});

describe('API change password', () => {
  it('success change password user', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const { id } = login.body.data;
    const newPassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin1234',
      confirmPassword: 'admin1234',
    };
    const response = await request(app)
      .patch(`/api/v1/user/change-password/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newPassword);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Pembaruan Kata Sandi berhasil');
  });

  it('failed change password, because password does not match', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const { id } = login.body.data;
    const newPassword = {
      oldPassword: 'admin1234',
      newPassword: 'admin1234',
      confirmPassword: 'admin123',
    };
    const response = await request(app)
      .patch(`/api/v1/user/change-password/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newPassword);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Password tidak sesuai');
  });
  it('failed change password, because old password does not match', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const login = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const { token } = login.body.data;
    const { id } = login.body.data;
    const newPassword = {
      oldPassword: 'admin',
      newPassword: 'admin1234',
      confirmPassword: 'admin1234',
    };
    const response = await request(app)
      .patch(`/api/v1/user/change-password/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newPassword);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Password lama tidak sesuai');
  });
});
