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
import helper from './test_helper'
const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await api.post('/api/user').send(helper.initialUser)
})

test('can make user', async () => {
  await api
    .post('/api/user')
    .send(helper.newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})

test('duplicate user cannot be made', async () => {
  const response = await api.post('/api/user').send(helper.initialUser).expect(400)

  assert.strictEqual(
    response.text,
    'Username is already taken',
    'Expected message "Username is already taken" in response'
  )
})

test('users are returned with get request', async () => {
  const response = await api.get('/api/user').expect(200)

  const usernames = response.body.map(e => e.username)
  assert(usernames.includes('test123'))
})

test('user can log in with valid credentials', async () => {
  const response = await api.post('/api/login').send(helper.initialUser).expect(200)
  assert(response.body.token)
  assert(response.body.username === helper.initialUser.username)
})

test('user login fails with incorrect password', async () => {
  await api
    .post('/api/login')
    .send({ ...helper.initialUser, password: 'incorrect' })
    .expect(400)
})

test('user login fails with locked account', async () => {
  const lockedUser = { ...helper.initialUser, accountStatus: { locked: true } }
  await User.findOneAndUpdate({ username: helper.initialUser.username }, lockedUser)

  await api.post('/api/login').send(helper.initialUser).expect(403)
})

after(async () => {
  await mongoose.connection.close()
})
