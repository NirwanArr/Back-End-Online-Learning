/* eslint-disable no-undef */
const dotenv = require('dotenv');
const request = require('supertest');
const { Content } = require('../app/models');
const app = require('../app/index');

dotenv.config();

describe('API get all content', () => {
  it('success get all content', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');
    const userToken = responseUser.body;

    const responseData = await request(app)
      .get('/api/v1/content')
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('Success');
    expect(responseData.body.message).toBe('Konten data berhasil ditampilkan');
  });

  it('fails when content is empty', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');
    const userToken = responseUser.body;

    jest.spyOn(Content, 'findAll').mockResolvedValueOnce([]);
    const responseData = await request(app)
      .get('/api/v1/content')
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe('Konten data kosong');
  });
});

describe('API content by id', () => {
  it('success get content by id', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');
    const userToken = responseUser.body;

    const responseData = await request(app)
      .get('/api/v1/content/20')
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('Success');
    expect(responseData.body.message).toBe('Konten data berhasil ditampilkan');
  });

  it('fails when content by id is null', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);
    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');
    const userToken = responseUser.body;

    jest.spyOn(Content, 'findOne').mockResolvedValueOnce(null);

    const contentId = 1;
    const responseData = await request(app)
      .get(`/api/v1/content/${contentId}`)
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe(
      `Data konten dengan id: ${contentId} kosong`,
    );
  });
});

describe('API delete content by id', () => {
  it('success delete content by id', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');

    const userToken = responseUser.body;
    jest.spyOn(Content, 'destroy').mockResolvedValueOnce(1);

    const contentId = 16;
    const responseData = await request(app)
      .delete(`/api/v1/content/deleted/${contentId}`)
      .set('Authorization', `Bearer ${userToken.data}`);

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('success');
    expect(responseData.body.message).toBe('Sukses menghapus konten data');
  });

  it('fails when content by id is null', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };

    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');
    const userToken = responseUser.body.data;

    const contentId = 100;
    const responseData = await request(app)
      .delete(`/api/v1/content/deleted/${contentId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe('Data konten tidak ditemukan!');
  });
});

describe('API insert content by link', () => {
  it('success insert content by link', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const chapterId = 1;
    const contentTitle = 'Sample Content';
    const contentUrl = 'https://youtu.be/ixOd42SEUF0';
    const videoDuration = '02.36'; // Format waktu video

    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');

    const userToken = responseUser.body;

    const youtubeId = contentUrl.match(/youtu\.be\/([^?]+)/)[1];

    const mockData = jest.spyOn(Content, 'create').mockResolvedValueOnce({
      id: 1,
      chapterId,
      contentTitle,
      contentUrl,
      youtubeId,
      duration: videoDuration,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const responseData = await request(app)
      .post(`/api/v1/content/insert-bylink/${chapterId}`) // Perbaiki endpoint
      .set('Authorization', `Bearer ${userToken.data}`)
      .send({
        contentTitle,
        contentUrl,
        videoDuration,
      });

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('Success');
    expect(responseData.body.message).toBe('Sukses menambahkan data konten');

    mockData.mockRestore();
  });
});

describe('API update content by link', () => {
  it('success update content by link', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const chapterId = 6;
    const contentId = 20;
    const contentTitle = 'Sample Content Update';
    const contentUrl = 'https://youtu.be/ixOd42SEUF0';
    const videoDuration = '02:36';

    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');

    const userToken = responseUser.body;

    // const youtubeId = contentUrl.match(/youtu\.be\/([^?]+)/)[1];

    const mockUpdateById = jest
      .spyOn(Content, 'update')
      .mockResolvedValueOnce(1);

    const responseData = await request(app)
      .patch(`/api/v1/content/update-bylink/${chapterId}/${contentId}`)
      .set('Authorization', `Bearer ${userToken.data}`)
      .send({
        contentTitle,
        contentUrl,
        videoDuration,
      });

    expect(responseData.statusCode).toBe(200);
    expect(responseData.body.status).toBe('success');

    mockUpdateById.mockRestore();
  });

  it('fails when content is not found', async () => {
    const user = {
      email: 'adminc8@mail.com',
      password: 'admin1234',
    };
    const chapterId = 1;
    const contentId = 1;
    const contentTitle = 'Sample Content Update';
    const contentUrl = 'https://youtu.be/ixOd42SEUF0';
    const videoDuration = '02:36';

    const responseUser = await request(app)
      .post('/api/v1/auth/admin/login')
      .send(user);

    expect(responseUser.statusCode).toBe(200);
    expect(responseUser.body.status).toBe('Success');
    expect(responseUser.body.message).toBe('Berhasil login');

    const userToken = responseUser.body;

    jest.spyOn(Content, 'findOne').mockResolvedValueOnce(null);

    const responseData = await request(app)
      .patch(`/api/v1/content/update-bylink/${chapterId}/${contentId}`)
      .set('Authorization', `Bearer ${userToken.data}`)
      .send({
        contentTitle,
        contentUrl,
        videoDuration,
      });

    expect(responseData.statusCode).toBe(404);
    expect(responseData.body.status).toBe('Failed');
    expect(responseData.body.message).toBe('Data konten tidak ditemukan!');

    jest.spyOn(Content, 'findOne').mockRestore();
  });
});
