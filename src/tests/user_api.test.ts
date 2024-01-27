import request from 'supertest'
import express from 'express'

const app = express()

app.get('/user', function (_req, res) {
  res.status(200).json({ name: 'john' })
})

void request(app, { http2: true })
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function (err, _res) {
    if (err) throw err
  })

void request
  .agent(app, { http2: true })
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end(function (err, _res) {
    if (err) throw err
  })
