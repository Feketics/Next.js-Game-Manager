import fetch, { Request, Response } from 'node-fetch';
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

import { GET, POST, PUT, DELETE, OPTIONS } from '../../app/api/games/route';

beforeEach(() => {
  jest.resetModules();
});

describe('API /api/games operations', () => {
  test('OPTIONS returns proper CORS headers', async () => {
    const response = await OPTIONS();
    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  test('GET returns paginated data and total count', async () => {
    const request = new Request('http://localhost/api/games?page=1&limit=8');
    const response = await GET(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(Array.isArray(json.data)).toBe(true);
    expect(typeof json.total).toBe('number');
    expect(json.total).toBeGreaterThanOrEqual(json.data.length);
  });

  test('POST creates a new game with valid data', async () => {
    const newGameData = {
      name: 'Test Game',
      description: 'Test description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 7,
      category: 'Test Category',
    };
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGameData),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const json = await response.json();
    expect(json).toMatchObject(newGameData);
    expect(json).toHaveProperty('id');
  });

  test('POST returns validation error for invalid rating', async () => {
    const invalidData = {
      name: 'Invalid Game',
      description: 'Test description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 15,
      category: 'Test Category',
    };
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('errors');
    expect(json.errors.length).toBeGreaterThan(0);
  });

  test('POST returns validation error for invalid publish year', async () => {
    const invalidData = {
      name: 'Invalid Game',
      description: 'Test description',
      publisher: 'Test Publisher',
      datePublished: '1960-01-01',
      rating: 7,
      category: 'Test Category',
    };
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('errors');
    expect(json.errors.length).toBeGreaterThan(0);
  });

  test('POST returns validation error for multiple invalid data', async () => {
    const invalidData = {
      name: '',
      description: '',
      publisher: '',
      datePublished: '2026-01-01',
      rating: 15,
      category: '',
    };
    const request = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidData),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('errors');
    expect(json.errors.length).toBeGreaterThan(5);
  });

  test('PUT updates an existing game', async () => {
    const newGameData = {
      name: 'Updatable Game',
      description: 'Original description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 6,
      category: 'Test Category',
    };
    const postRequest = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGameData),
    });
    const postResponse = await POST(postRequest);
    expect(postResponse.status).toBe(201);
    const createdGame = await postResponse.json();

    const updatedData = { ...createdGame, name: 'Updated Game', rating: 8 };
    const putRequest = new Request('http://localhost/api/games', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const putResponse = await PUT(putRequest);
    expect(putResponse.status).toBe(200);
    const updatedGame = await putResponse.json();
    expect(updatedGame.name).toBe('Updated Game');
    expect(updatedGame.rating).toBe(8);
  });

  test('PUT returns error when updating existing game with invalid data', async () => {
    const newGameData = {
      name: 'Updatable Game',
      description: 'Original description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 6,
      category: 'Test Category',
    };
    const postRequest = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGameData),
    });
    const postResponse = await POST(postRequest);
    expect(postResponse.status).toBe(201);
    const createdGame = await postResponse.json();

    const updatedData = { ...createdGame, name: '', rating: 11 };
    const putRequest = new Request('http://localhost/api/games', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const putResponse = await PUT(putRequest);
    expect(putResponse.status).toBe(400);
    const json = await putResponse.json();
    expect(json).toHaveProperty('errors');
    expect(json.errors.length).toBeGreaterThan(0);
  });

  test('PUT returns error when game id is missing', async () => {
    const invalidUpdateData = {
      name: 'No ID Game',
      description: 'Test description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 5,
      category: 'Test Category',
    };
    const request = new Request('http://localhost/api/games', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidUpdateData),
    });
    const response = await PUT(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toHaveProperty('error');
  });

  test('DELETE removes an existing game', async () => {
    const newGameData = {
      name: 'Deletable Game',
      description: 'Test description',
      publisher: 'Test Publisher',
      datePublished: '2022-01-01',
      rating: 7,
      category: 'Test Category',
    };
    const postRequest = new Request('http://localhost/api/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGameData),
    });
    const postResponse = await POST(postRequest);
    expect(postResponse.status).toBe(201);
    const createdGame = await postResponse.json();

    const deleteRequest = new Request(`http://localhost/api/games?id=${createdGame.id}`, {
      method: 'DELETE',
    });
    const deleteResponse = await DELETE(deleteRequest);
    expect(deleteResponse.status).toBe(200);
    const deletedGame = await deleteResponse.json();
    expect(deletedGame.id).toBe(createdGame.id);
  });

  test('DELETE returns error when id is missing', async () => {
    const deleteRequest = new Request('http://localhost/api/games', {
      method: 'DELETE',
    });
    const deleteResponse = await DELETE(deleteRequest);
    expect(deleteResponse.status).toBe(400);
    const json = await deleteResponse.json();
    expect(json).toHaveProperty('error');
  });
});
