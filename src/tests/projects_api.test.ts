/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import User from '../models/user.js'
import Project from '../models/project.js'
const api = supertest(app)

import helper from './test_helper.js'

let authToken
let initialId
let returnedProject

describe('Project API', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Project.deleteMany({})
    await api.post('/api/user').send(helper.initialUser)
    const response = await api.post('/api/login').send(helper.initialUser)

    authToken = response.body.token
    console.log('API TEST TOKEN: '.authToken)
    const projectRes = await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(helper.initialProject)
    initialId = projectRes.body.id
    returnedProject = projectRes.body
    console.log('OVER HERE:', authToken, 'AND: ', initialId)
  })

  test('POST /api/projects creates a new project', async () => {
    const response = await api
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(helper.sampleProject)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, helper.sampleProject.title)
    assert.strictEqual(response.body.project, helper.sampleProject.project)
  })

  test('POST /api/projects fails without token', async () => {
    const response = await api
      .post('/api/projects')
      .send(helper.sampleProject)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token missing')
  })

  test('GET /api/projects returns all projects', async () => {
    const response = await api
      .get('/api/projects')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(Array.isArray(response.body))
  })

  test('PUT /api/projects/:id updates a project with token', async () => {
    const updatedProject = { ...returnedProject, title: 'Updated Title' }
    const response = await api
      .put(`/api/projects/${initialId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedProject)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedProject.title)
  })

  test('PUT /api/projects/:id fails without token', async () => {
    const updatedProject = {
      ...helper.initialProject,
      title: 'Updated Title',
      id: initialId,
    }
    const response = await api
      .put(`/api/projects/${initialId}`)
      .send(updatedProject)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token missing')
  })

  test('DELETE /api/projects/:id fails without token', async () => {
    const response = await api
      .delete(`/api/projects/${initialId}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.error, 'token missing')
  })

  test('DELETE /api/projects/:id deletes a project', async () => {
    const response = await api
      .delete(`/api/projects/${initialId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)

    assert.strictEqual(response.status, 200)

    const deletedProject = await Project.findById(initialId)
    assert.strictEqual(deletedProject, null)
  })
})

after(async () => {
  await mongoose.connection.close()
})
