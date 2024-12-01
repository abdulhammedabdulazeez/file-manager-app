const redis = require("redis");
// const client = redis.createClient({
//   url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
// });

const client = redis.createClient({
  password: "g8ro0Ow0e9xye4bRzP3btz0RPaUUTtNd",
  socket: {
    host: "redis-10212.c308.sa-east-1-1.ec2.redns.redis-cloud.com",
    port: 10212,
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.connect().catch(console.error);

module.exports = client;
