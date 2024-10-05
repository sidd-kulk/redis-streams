import request from 'supertest'
import express from 'express'
import createApp from '../../src/configs/express.config'

describe('Server', () => {
  let app: express.Application

  beforeAll(() => {
    app = createApp()
  })

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health')
      expect(response.status).toBe(200)
      expect(response.text).toBe('OK')
    })
  })
})
