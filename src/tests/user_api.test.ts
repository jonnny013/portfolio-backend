/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import User from '../models/user'

const api = supertest(app)

const initialUser = {
  username: 'test123',
  password: 'test123',
}

const newUser = {
  username: 'test124',
  password: 'test123',
}

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User(initialUser)
  await user.save()
})

test('can make user', async () => {
  await api
    .post('/api/user')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('users are returned with get request', async () => {
  const response = await api.get('/api/user').expect(200)

  const usernames = response.body.map(e => e.username)
  assert(usernames.includes('test123'))
})

after(async () => {
  await mongoose.connection.close()
})
