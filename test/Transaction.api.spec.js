/* eslint-disable no-undef */
const request = require('supertest');
const dotenv = require('dotenv');
const app = require('../app/index');

dotenv.config();
const { Transaction } = require('../app/models');

describe('API create transaction', () => {
  it('success create transaction', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');

    const userToken = loginResponse.body.data.token;

    const courseId = 6;
    const responseTransaction = await request(app)
      .post(`/api/v1/transaction/${courseId}`)
      .set('Authorization', `Bearer ${userToken}`)

    expect(responseTransaction.statusCode).toBe(201);
    expect(responseTransaction.body.status).toBe('Success');
  }, 10000);

  it('Failed create transaction, order Id not found', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');

    const userToken = loginResponse.body.data.token;

    const invalidCourseId = 9999;

    const responseTransaction = await request(app)
      .post(`/api/v1/transaction/${invalidCourseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(responseTransaction.statusCode).toBe(404);
    expect(responseTransaction.body.status).toBe('Failed');
    expect(responseTransaction.body.message).toBe(
      `Kursus dengan ID: ${invalidCourseId} tidak ditemukan`,
    );
  });

  it('Failed create transaction, unpaid transaction exists', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');

    const userToken = loginResponse.body.data.token;

    const courseId = 6;

    const responseTransaction = await request(app)
      .post(`/api/v1/transaction/${courseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(responseTransaction.statusCode).toBe(409);
    expect(responseTransaction.body.status).toBe('Failed');
    expect(responseTransaction.body.message).toBe(
      'Anda memiliki transaksi yang belum dibayar untuk kursus ini, silahkan cek riwayat transaksi',
    );
  });

  it('Failed create transaction, already purchased', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponseData = {
      statusCode: 200,
      body: {
        status: 'Success',
        message: 'Login berhasil',
        data: {
          token: 'mocked-token',
        },
      },
    };

    jest.spyOn(request(app), 'post').mockResolvedValueOnce(loginResponseData);

    jest.spyOn(Transaction, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(Transaction, 'findOne').mockResolvedValueOnce({
      courseId: 4,
      status: 'unpaid',
    });

    jest.spyOn(Transaction, 'findOne').mockResolvedValueOnce({
      courseId: 4,
      status: 'paid',
    });

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);
    const userToken = loginResponse.body.data.token;
    const courseId = 4;

    const responseTransaction = await request(app)
      .post(`/api/v1/transaction/${courseId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    expect(responseTransaction.statusCode).toBe(400);
    expect(responseTransaction.body.status).toBe('Failed');
    expect(responseTransaction.body.message).toBe(
      'Anda sudah membeli kursus ini sebelumnya',
    );
    jest.restoreAllMocks();
  });
});

describe('API admin get data transaction', () => {
  it('success get data transaction', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Berhasil login');
    const userToken = response.body;

    const responseData = await request(app)
      .get('/api/v1/transaction')
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('Success');
  }, 3000);

  it('Failed get data transaction', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Berhasil login');
    const userToken = response.body;

    jest.spyOn(Transaction, 'findAll').mockResolvedValueOnce([]);

    const responseData = await request(app)
      .get('/api/v1/transaction')
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe(
      'Data transaksi kosong atau tidak ditemukan',
    );
  });
});

describe('API get payment detail', () => {
  it('success get payment detail', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponseData = {
      statusCode: 200,
      body: {
        status: 'Success',
        message: 'Login berhasil',
        data: {
          token: 'mocked-token',
        },
      },
    };
    jest.spyOn(request(app), 'post').mockResolvedValueOnce(loginResponseData);

    jest.spyOn(Transaction, 'findOne').mockResolvedValueOnce({
      paymentStatus: 'unpaid',
      id: 12,
      courseName: 'Mastery Product Management',
      userId: 3,
      courseId: 6,
      totalPrice: 222000,
      ppn: 22000,
      price: 200000,
      orderId: 7050,
      linkPayment:
        'https://app.sandbox.midtrans.com/snap/v3/redirection/ce98d7f3-7642-4d3e-81fa-7fef45ac5bf6',
      updatedAt: '2023-12-17T13:17:23.650Z',
      createdAt: '2023-12-17T13:17:23.650Z',
      paymentMethod: null,
    });

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    const userToken = loginResponse.body.data.token;
    const orderId = 7050;

    const responseDataCourse = await request(app)
      .get(`/api/v1/transaction/${orderId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(responseDataCourse.statusCode).toBe(200);
    expect(responseDataCourse.body.status).toBe('Success');
  });

  it('failed get payment detail', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponseData = {
      statusCode: 200,
      body: {
        status: 'Success',
        message: 'Login berhasil',
        data: {
          token: 'mocked-token',
        },
      },
    };
    jest.spyOn(request(app), 'post').mockResolvedValueOnce(loginResponseData);

    jest.spyOn(Transaction, 'findOne').mockResolvedValueOnce(null);

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    const userToken = loginResponse.body.data.token;
    const orderId = 7050;

    const responseDataCourse = await request(app)
      .get(`/api/v1/transaction/${orderId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(responseDataCourse.statusCode).toBe(404);
    expect(responseDataCourse.body.status).toBe('Failed');
    expect(responseDataCourse.body.message).toBe(
      `Detail pembayaran dengan ID: ${orderId} tidak ditemukan`,
    );
  });
});

describe('API get payment callback', () => {
  it('success get ', async () => {
    const loginCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(loginCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');

    const userToken = loginResponse.body.data.token;
    const responseTransaction = await request(app)
      .post('/api/v1/transaction/payment-callback')
      .set('Authorization', `Bearer ${userToken}`);

    expect(responseTransaction.statusCode).toBe(200);
    expect(responseTransaction.body.message).toBe('Success');
  });
});

describe('API history transaction', () => {
  it('success get history transaction', async () => {
    const memberCredentials = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(memberCredentials);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');
    const { token } = loginResponse.body.data;

    const responseData = await request(app)
      .get('/api/v1/transaction/history')
      .set('Authorization', `Bearer ${token}`);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('Success');
  });

  it('fails when user transaction history is empty', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');
    const { token } = loginResponse.body.data;

    const responseData = await request(app)
      .get('/api/v1/transaction/history')
      .set('Authorization', `Bearer ${token}`);

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe('Data transaksi kosong');
  });
});
