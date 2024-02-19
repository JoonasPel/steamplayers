const redis = require("redis");
const { Client } = require("pg");

const priorityTable = "a_priority_table";
const currentTable = "currentplayers";
const trendingTable = "a_trending_daily";
const affDataTable = "affdata";
const trendingGamesIncluded = 10;

// connect to redis and test connection.
// return client or undefined if error
const connectRedis = async () => {
  const client = redis.createClient({
    url: process.env.redisUrl,
  });
  try {
    await client.connect();
    if (await client.ping() == "PONG") {
      return client;
    }
  } catch (error) {
    console.log("Error connecting to redis:", error);
  }
  return undefined;
};

// connect to database
// return client or undefined if error
const connectRDS = async () => {
  const client = new Client({
    host: process.env.hostUrl,
    port: process.env.port,
    database: process.env.databaseName,
    user: process.env.user,
    password: process.env.password,
  });
  try {
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to RDS', error);
  }
  return undefined;
};

// close connections to redis and rds
const closeConnections = async (redisClient, rdsClient) => {
  await redisClient.quit();
  await rdsClient.end();
};

// TODO ERROR HANDLING
// gets players information from currentplayers table
const getStatisticsFromRDS = async (rdsClient) => {
  const response = await rdsClient.query(`
        SELECT cp.gameid, cp.playercount, cp.peak, cp.bottom,
        COALESCE(pt.gamename, 'unknown') as gamename
        FROM ${currentTable} as cp
        LEFT JOIN ${priorityTable} as pt ON cp.gameid = pt.gameid
        ORDER BY cp.playercount DESC;
    `);
  const rows = response.rows;
  const items = [];
  const items2 = [];
  for (let row of rows) {
    const stringifiedRow = JSON.stringify(row);
    items.push({ score: Number(row.playercount), value: stringifiedRow });
    items2.push(row.gamename);
    items2.push(stringifiedRow);
  }
  return [items, items2];
};

const getDailyTrendingRDS = async (rdsClient) => {
  const response = await rdsClient.query(`
        SELECT td.gameid, td.increase,
        COALESCE(pt.gamename, 'unknown') as gamename
        FROM ${trendingTable} as td
        LEFT JOIN ${priorityTable} as pt ON td.gameid = pt.gameid
        ORDER BY td.increase DESC
        LIMIT ${trendingGamesIncluded};
    `);
  const rows = response.rows;
  return rows;
};

const getAffDataRDS = async (rdsClient) => {
  const response = await rdsClient.query(`
    SELECT ad.gameid, ad.url, ad.price, ad.retailprice
    FROM ${affDataTable} as ad
    LEFT JOIN ${trendingTable} as td ON ad.gameid = td.gameid
    ORDER BY td.increase DESC
    LIMIT ${trendingGamesIncluded};
  `);
  const rows = response.rows;
  return rows;
};

// delete old players and save new
// TODO ERROR HANDLING
const saveToRedis = async (redisClient, items) => {
  await redisClient.del("players");
  await redisClient.ZADD("players", items);
};

exports.handler = async (event) => {
  try {
    const redisClient = await connectRedis();
    const rdsClient = await connectRDS();
    if (!redisClient) { throw new Error('redis connection error') }
    if (!rdsClient) { throw new Error('rds connection error') }

    // get needed data from rds and save to redis
    const [items, items2] = await getStatisticsFromRDS(rdsClient);
    await saveToRedis(redisClient, items);
    // saves every game also as key(gamename)-value(data) for search feature
    await redisClient.MSET(items2);
    const daily = await getDailyTrendingRDS(rdsClient);
    await redisClient.set('trendingDaily', JSON.stringify(daily));
    const affData = await getAffDataRDS(rdsClient);
    await redisClient.set('affData', JSON.stringify(affData));

    await closeConnections(redisClient, rdsClient);
    return { statusCode: 200 };
  } catch (error) {
    return { statusCode: 500, error: error?.message }
  }
};