import { createClient } from 'redis';

// configure redis client
export const redisClient = createClient({
    url: "redis://localhost:6379",
})

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connected', () => console.log('Redis Client Connected'));


