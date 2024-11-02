import { createClient } from 'redis'


export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
})

redisClient.on('error', err => console.info('Redis Client Error', err))
redisClient.on('connect', () => console.info('Redis Client Connected'))
