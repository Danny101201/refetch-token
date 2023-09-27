import { createClient } from 'redis'
const redisUrl = `redis://localhost:6379`;
export const redisClient = createClient({
  url: redisUrl
})
const connectRedis = async () => {
  try {
    console.log('? Redis client connected...');

    await redisClient.connect()
    redisClient.set(
      'trpc',
      'welcome to trpc'
    )
  } catch (e: any) {
    await redisClient.disconnect()
    console.log(e.message)
    process.exit(1)
  }
}

connectRedis()
redisClient.on('error', (err) => console.error(err))
