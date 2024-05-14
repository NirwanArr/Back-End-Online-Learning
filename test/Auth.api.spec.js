/* eslint-disable no-undef */
const request = require('supertest');
const dotenv = require('dotenv');
const app = require('../app/index');

dotenv.config();

const EMAIL_TESTING = 'nirwan12@gmail.com';
describe('API Register', () => {
  it('success register', async () => {
    const user = {
      email: EMAIL_TESTING,
      password: '12345678',
      name: 'nirwan',
      phoneNumber: '01234567',
      country: 'Indonesia',
      city: 'Tangerang',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/register')
      .send(user);
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe('Registrasi berhasil');
  }, 10000);

  it('Failed register because name is missing or empty', async () => {
    const user = {
      email: 'member_test@gmail.com',
      password: '12345678',
      phoneNumber: '01234567',
      country: 'Indonesia',
      city: 'Tangerang',
    };

    const response = await request(app)
      .post('/api/v1/auth/member/register')
      .send(user);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Nama tidak boleh kosong');
  });

  it('Failed register because user password minimum not match', async () => {
    const user = {
      email: 'member02@gmail.com',
      password: '123',
      name: 'nirwan',
      phoneNumber: '01234567',
      country: 'Indonesia',
      city: 'Tangerang',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Panjang kata sandi minimal harus 8 karakter',
    );
  });

  it('Failed register because email already exist', async () => {
    const user = {
      email: EMAIL_TESTING,
      password: '12345678',
      name: 'nirwan',
      phoneNumber: '01234567',
      country: 'Indonesia',
      city: 'Tangerang',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email pengguna sudah digunakan');
  });

  it('Failed register because email is invalid', async () => {
    const user = {
      email: 'nirwan.arrachgmail.com',
      password: '12345678',
      name: 'nirwan',
      phoneNumber: '01234567',
      country: 'Indonesia',
      city: 'Tangerang',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/register')
      .send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Alamat email tidak valid.');
  });
});

describe('API Login', () => {
  it('success login', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Login berhasil');
  });

  it('Failed login because user not verified', async () => {
    const user = {
      email: EMAIL_TESTING,
      password: '12345678',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Pengguna belum diverifikasi');
  });

  it('Failed login because email not found', async () => {
    const user = {
      email: 'zzz@gmail.com',
      password: '123456789',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Email tidak ditemukan');
  });

  it('Failed login because wrong password', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'salahpassword',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Kata sandi salah');
  });
});

describe('API Login admin', () => {
  it('success login', async () => {
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
  });

  it('Failed login because user is not an admin', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Hanya admin yang dapat login');
  });

  it('Failed login because email not found', async () => {
    const user = {
      email: 'zzz@gmail.com',
      password: '123456789',
    };
    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Email tidak ditemukan');
  });

  it('Failed login because wrong password', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'salahpassword',
    };
    const response = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Kata sandi salah');
  });
});

describe('API Auht Me', () => {
  it('success get profile by token', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };
    const response = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);
    const userToken = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Login berhasil');

    const responseAuthMe = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${userToken.data.token}`)
      .send(user);
    expect(responseAuthMe.statusCode).toBe(200);
    expect(responseAuthMe.body.status).toBe('Success');
  });

  it('fails to get profile without authorization token', async () => {
    const user = {
      email: 'memberc8@mail.com',
      password: 'admin1234',
    };

    const loginResponse = await request(app)
      .post('/api/v1/auth/member/login')
      .send(user);

    // const userToken = loginResponse.body.data.token;

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.status).toBe('Success');
    expect(loginResponse.body.message).toBe('Login berhasil');

    const responseAuthMe = await request(app).get('/api/v1/auth/me').send(user);

    expect(responseAuthMe.statusCode).toBe(401);
    expect(responseAuthMe.body.status).toBe('Failed');
    expect(responseAuthMe.body.message).toBe('Anda harus masuk');
  });
});

describe('API OTP verification', () => {
  it('success OTP verification', async () => {
    const user = {
      email: 'memberc8@mail.com',
    };
    const response = await request(app).post('/api/v1/auth/new-otp').send(user);
    const userOtp = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.data.message).toBe('OTP berhasil terkirim');

    const responseOtp = await request(app)
      .post(`/api/v1/auth/verify-otp/${userOtp.data.newOtpRequest.userId}`)
      .send({
        code: userOtp.data.newCode,
      });
    expect(responseOtp.statusCode).toBe(200);
    expect(responseOtp.body.status).toBe('Success');
    expect(responseOtp.body.message).toBe('Verifikasi OTP berhasil');
  });

  it('failed OTP verification - expired code', async () => {
    const user = {
      email: 'memberc8@mail.com',
    };
    const response = await request(app).post('/api/v1/auth/new-otp').send(user);
    const userOtp = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.data.message).toBe('OTP berhasil terkirim');

    const responseOtp = await request(app)
      .post('/api/v1/auth/verify-otp/100')
      .send({
        code: userOtp.data.newCode,
      });
    expect(responseOtp.statusCode).toBe(401);
    expect(responseOtp.body.status).toBe('Failed');
    expect(responseOtp.body.message).toBe('Kode OTP telah kedaluwarsa');
  }, 10000);

  it('failed OTP verification - invalid code', async () => {
    const user = {
      email: 'memberc8@mail.com',
    };
    const response = await request(app).post('/api/v1/auth/new-otp').send(user);
    const userOtp = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.data.message).toBe('OTP berhasil terkirim');

    const responseOtp = await request(app)
      .post(`/api/v1/auth/verify-otp/${userOtp.data.newOtpRequest.userId}`)
      .send({
        code: 'invalid_code',
      });
    expect(responseOtp.statusCode).toBe(403);
    expect(responseOtp.body.status).toBe('Failed');
    expect(responseOtp.body.message).toBe('OTP tidak valid');
  });
});

describe('API reset Password', () => {
  it('success reset Password', async () => {
    const user = {
      password: 'admin1234',
    };
    const response = await request(app)
      .patch('/api/v1/auth/reset-password/2')
      .send(user);
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Pembaruan Kata Sandi berhasil');
  });

  it('failed update Password due to unverified user', async () => {
    const user = {
      password: 'admin1234',
    };
    const unverifiedUserId = 4;
    const response = await request(app)
      .patch(`/api/v1/auth/reset-password/${unverifiedUserId}`)
      .send(user);

    expect(response.statusCode).toBe(401);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Pengguna belum diverifikasi');
  });
});

describe('API send new OTP', () => {
  it('success send OTP', async () => {
    const user = {
      email: 'memberc8@mail.com',
    };
    const response = await request(app).post('/api/v1/auth/new-otp').send(user);
    // const userOtp = response.body;
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.data.message).toBe('OTP berhasil terkirim');
  }, 10000);

  it('fails when user is not found', async () => {
    const nonExistingUser = {
      email: 'nonexistentuser@mail.com',
    };
    const response = await request(app)
      .post('/api/v1/auth/new-otp')
      .send(nonExistingUser);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe('Failed');
    expect(response.body.message).toBe('Pengguna tidak ditemukan');
  });
});
