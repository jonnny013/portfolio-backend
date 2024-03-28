/* eslint-disable @typescript-eslint/no-floating-promises */
import { test, after } from 'node:test';
import mongoose from 'mongoose'
import supertest from 'supertest';
import app from '../app';

const api = supertest(app)

test('projects are returned as json', async () => {
  await api
    .get('/api/projects')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})