const redis = require('redis');

const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

// Connect once when the app starts
client.on('error', (err) => console.error({ func: 'Redis', file: 'cacheLib', error: err }));
client.on('ready', () => console.info('Redis is running'));
client.connect(); // returns a Promise but you can fire-and-forget if called on startup

const logStruct = (func, error) => ({ func, file: 'cacheLib', error });

exports.set = async (key, value, expireIn) => {
  try {
    // expireIn is seconds
    let options = {};
    if (expireIn) {
      options.EX = expireIn; // set TTL directly
    }

    const response = await client.set(key, JSON.stringify(value), options);
    return response; // "OK" on success
  } catch (error) {
    console.error('error -> ', logStruct('set', error));
    throw error;
  }
};

exports.get = async (key) => {
  try {
    const response = await client.get(key);
    return response ? JSON.parse(response) : null;
  } catch (error) {
    console.error('error -> ', logStruct('get', error));
    throw error;
  }
};

