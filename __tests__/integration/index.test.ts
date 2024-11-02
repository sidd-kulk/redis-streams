import request from 'supertest'
import express from 'express'
import createApp from '../../src/configs/express.config'
import { redisClient } from '../../src/redis-streams-client'

describe('Server', () => {
  let app: express.Application

  beforeAll(async () => {
    // Ensure Redis is connected before running tests
    try {
      await redisClient.connect();
      app = createApp()
      jest.spyOn(console, 'info').mockImplementation(() => { });
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  })

  afterAll(async () => {
    try {
      await redisClient.quit();
    } catch (error) {
      console.error('Error disconnecting from Redis:', error);
    }
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health')
      expect(response.status).toBe(200)
      expect(response.text).toBe('OK')
    })
  })
})
