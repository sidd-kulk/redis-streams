import createApp from './configs/express.config'
import { redisClient } from './redis-streams-client';

const PORT = 10000

const app = createApp()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

