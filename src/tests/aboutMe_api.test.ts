/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { test, beforeEach, describe, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import User from '../models/user.js'
import AboutMePost from '../models/aboutMePost.js'
const api = supertest(app)

import helper from './test_helper.js'

//let authToken

describe('AboutMe API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await AboutMePost.deleteMany({})
    await api.post('/api/user').send(helper.initialUser)
    //const response = await api.post('/api/login').send(helper.initialUser)
    await api.post('/api/login').send(helper.initialUser)
    //console.log('success???: ', response.body)
    //authToken = response.body.token
    const newAboutme = new AboutMePost(helper.premadeAboutMe)
    await newAboutme.save()
  })

  test('GET /api/aboutMe returns aboutMe post if exists', async () => {
    const response = await api.get('/api/aboutMe').expect(200)
    console.log('CHECK HERE: ', response.body)
    assert.strictEqual(typeof response.body[0].name, 'string')
    assert.strictEqual(typeof response.body[0].description, 'string')
    assert.strictEqual(typeof response.body[0].picDesc, 'string')
    assert.strictEqual(typeof response.body[0].type, 'string')
    assert.strictEqual(typeof response.body[0].picture, 'string')
  })

  // test('POST /api/aboutMe with token and picture creates a new aboutMe post', async () => {
  //   const response = await api
  //     .post('/api/aboutMe')
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .attach('picture', '../../public/images/1706172907943.png')
  //     .field('name', 'John Doe')
  //     .field('description', 'About me description')
  //     .field('picDesc', 'Picture description')
  //     .field('type', 'Personal')
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)

  //   assert.strictEqual(response.body.name, 'John Doe')
  //   assert.strictEqual(response.body.description, 'About me description')
  //   assert.strictEqual(response.body.picDesc, 'Picture description')
  //   assert.strictEqual(response.body.type, 'Personal')
  //   assert.strictEqual(typeof response.body.picture, 'string')
  // })

  test('POST /api/aboutMe without token should fail with "token missing" error', async () => {
    const response = await api
      .post('/api/aboutMe')
      .field('name', 'John Doe')
      .field('description', 'About me description')
      .field('picDesc', 'Picture description')
      .field('type', 'Personal')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token missing')
  })

  // Add more tests for GET, PUT, DELETE endpoints

  // GET /api/aboutMe/:id
  // PUT /api/aboutMe/:id
  // DELETE /api/aboutMe/:id
})

after(async () => {
  await mongoose.connection.close()
})
