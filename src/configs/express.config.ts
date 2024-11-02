import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { redisClient } from '../redis-streams-client'
import streamRoutes from '../routes/stream.routes'


dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' })

const createApp = () => {
  const app = express()
  
  redisClient.connect()
  app.get('/health', (req, res) => {
    if (redisClient.isReady) {
      res.status(200).send('OK')
    } else {
      res.status(500).send('Application is not Ready. Failed')
    }
  })

  app.use(bodyParser.json())
  app.use('', streamRoutes)
  return app
}

export default createApp
