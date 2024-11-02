import { Router } from 'express'
import { redisClient } from '../redis-streams-client'

const router = Router()

router.post('/stream/message', async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const streamName = 'mystream'
    const messageId = await redisClient.xAdd(streamName, '*', { 
      'message': message,
      'timestamp': Date.now().toString()
    })

    res.status(201).json({ 
      success: true, 
      messageId,
      stream: streamName 
    })
  } catch (error) {
    console.error('Error publishing message:', error)
    res.status(500).json({ error: 'Failed to publish message' })
  }
})

export default router 