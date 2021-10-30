const redis = require("redis");
const bluebird = require("bluebird")
bluebird.promisifyAll(redis)

const rd = redis.createClient({
    host: process.env.REDIS_SERVER_ADDR,
    port: process.env.REDIS_SERVER_PORT
});

exports.rd = rd
exports.spinupRedis = new Promise((resolve, reject) => {
    // redisClient.on("error", (err) => {
    //     console.log("error", err)
    // });

    // redisClient.on("connect", (err) => {
    //     console.log("connect");
    // });

    this.rd.on("ready", (err) => {
        if (err) reject()
        console.info('- RD READY');
        resolve();
    });
})

