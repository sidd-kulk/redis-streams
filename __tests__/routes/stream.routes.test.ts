import request from 'supertest'
import express from 'express'
import { Router } from 'express'
import { redisClient } from '../../src/redis-streams-client'
import streamRoutes from '../../src/routes/stream.routes'

jest.mock('../../src/redis-streams-client', () => ({
  redisClient: {
    xAdd: jest.fn()
  }
}))

describe('Stream Routes', () => {
  let app: express.Application

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
  })

  beforeEach(() => {
    // Create fresh Express app for each test
    app = express()
    app.use(express.json())
    app.use('/api', streamRoutes)
    
    // Clear mock data
    jest.clearAllMocks()
  })

  describe('POST /api/stream/message', () => {
    // Happy Path Tests
    it('should successfully publish a message to the stream', async () => {
      const mockMessageId = '1711234567890-0'
      const testMessage = 'Hello World'
      ;(redisClient.xAdd as jest.Mock).mockResolvedValueOnce(mockMessageId)

      const response = await request(app)
        .post('/api/stream/message')
        .send({ message: testMessage })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({
        success: true,
        messageId: mockMessageId,
        stream: 'mystream'
      })
      expect(redisClient.xAdd).toHaveBeenCalledWith(
        'mystream',
        '*',
        expect.objectContaining({
          message: testMessage,
          timestamp: expect.any(String)
        })
      )
    })

    // Input Validation Tests
    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/api/stream/message')
        .send({})

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Message is required'
      })
      expect(redisClient.xAdd).not.toHaveBeenCalled()
    })

    it('should return 400 when message is empty string', async () => {
      const response = await request(app)
        .post('/api/stream/message')
        .send({ message: '' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Message is required'
      })
      expect(redisClient.xAdd).not.toHaveBeenCalled()
    })

    it('should return 400 when message is null', async () => {
      const response = await request(app)
        .post('/api/stream/message')
        .send({ message: null })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({
        error: 'Message is required'
      })
      expect(redisClient.xAdd).not.toHaveBeenCalled()
    })

    // Error Handling Tests
    it('should return 500 when Redis throws an error', async () => {
      (redisClient.xAdd as jest.Mock).mockRejectedValueOnce(
        new Error('Redis connection failed')
      )

      const response = await request(app)
        .post('/api/stream/message')
        .send({ message: 'Test message' })

      expect(response.status).toBe(500)
      expect(response.body).toEqual({
        error: 'Failed to publish message'
      })
    })

    // Content Type Tests
    it('should handle non-JSON requests appropriately', async () => {
      const response = await request(app)
        .post('/api/stream/message')
        .send('not-json-data')
        .set('Content-Type', 'text/plain')

      expect(response.status).toBe(400)
    })

    // Timestamp Validation
    it('should include valid timestamp in Redis stream entry', async () => {
      const mockMessageId = '1711234567890-2'
      const testMessage = 'Test message'
      ;(redisClient.xAdd as jest.Mock).mockResolvedValueOnce(mockMessageId)

      await request(app)
        .post('/api/stream/message')
        .send({ message: testMessage })

      const callArgs = (redisClient.xAdd as jest.Mock).mock.calls[0][2]
      const timestamp = parseInt(callArgs.timestamp)
      
      expect(timestamp).toBeLessThanOrEqual(Date.now())
      expect(timestamp).toBeGreaterThan(Date.now() - 1000) // Within last second
    })
  })
}) 