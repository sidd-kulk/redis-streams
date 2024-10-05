import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env' })

const createApp = () => {
  const app = express()

  app.get('/health', (req, res) => {
    res.status(200).send('OK')
  })

  app.use(bodyParser.json())

  return app
}

export default createApp
