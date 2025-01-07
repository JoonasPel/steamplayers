import axios from 'axios';
import validator from 'validator';
import redis from 'redis';

const axiosTimeout = 5000;
const maxQueryLength = 30;
const gamesReturned = 10;
const ec2Url = process.env.ec2url;
const redisUrl = process.env.redisurl;

const connectRedis = async () => {
    const client = redis.createClient({url: redisUrl});
    try {
        await client.connect();
        return client;
    } catch (error) {
        console.log("Error connecting to redis:", error);
    }
    return undefined;
};

const response = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: { 'Access-Control-Allow-Origin': '*', },
  };
}

const handleQuery = (event) => {
  let query = event?.queryStringParameters?.query ?? "";
  query = validator.escape(query);
  if (query.length > maxQueryLength) {
    query = query.slice(0, maxQueryLength);
  }
  return query;
}

const redisClient = await connectRedis();

export const handler = async (event, context) => {
  try {
    if (!redisClient) { throw new Error('redis connection error') }
    
    const query = handleQuery(event);
    if (!query) {
      return response(200, []);
    }

    const res = await axios.get(ec2Url, {
      params: {
        q: query
      }, 
      timeout: axiosTimeout
    });
    const gameNames = res?.data;
    let gameDataFalsysRemoved = [];
    if (gameNames.length > 0) {
      const rawGameData = await redisClient.MGET(gameNames);
      const gameData = rawGameData.map(item => JSON.parse(item));
      gameDataFalsysRemoved = gameData.filter(Boolean);
      gameDataFalsysRemoved.sort((a,b) => b.playercount - a.playercount);
    }
    return response(200, gameDataFalsysRemoved.slice(0, gamesReturned));

  } catch (error) {
    console.log(error);
    return response(500, []);
  }
};
