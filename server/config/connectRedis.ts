require("dotenv").config()
import { createClient } from "redis"

const redisClient = createClient({
    socket: {
        host: 'redis'
    }
})

const connectRedis = async () => {
    try {
        redisClient.connect()
            .then(() => console.log("Redis connected"))
    } catch (error: any) {
        console.log("error")
        console.log(error)
        setTimeout(connectRedis, 5000)
    }
}

export { redisClient, connectRedis }



