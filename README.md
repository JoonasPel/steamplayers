![Architecture diagram](https://github.com/JoonasPel/steamplayers/blob/main/images/architecture.png?raw=true)

## Steamplayers Project Overview:

Application uses the Steam API to collect real-time player data for Steam games.
The AWS hosted backend runs 24/7 and automatically fetches Steam API for the
<strong>current</strong> player counts in games every 30 minutes. Using the most recent data
combined with older data backend calculates the daily peak and bottom for every game, and also daily
trending games. Frontend shows scoreboard of the most played games, trending games and a search
feature allows searching for games. \
Steam API allows fetching for only one game per request, so the core backend has to be implemented in a scaled manner.

## Key Features:

### Database:

Collected data is stored in RDS(PostgreSQL). The DB includes game IDs and names, playercount history
with timestamps, current players counts, 24-hour peak and bottom playercounts and trending games
with their player increase percentage.

### Continuous data processing:

In core backend, EventBridge triggers Step Function every 30 minutes that orchestrates the data collecting and
processing. The first Lambda reads all game IDs from RDS and sends them as chunks into SQS. Items in
SQS trigger concurrent Lambdas that collect and process data into RDS. This is needed because
Steam API allows one game per request. Afterwards another Lambda calculates trending games, and
finally last Lambda puts all the data that is needed by clients to ElastiCache.

### Cache:

After the most recent data has been collected and processed, it is updated to the ElastiCache(redis)
with full cache invalidation to allow users to receive the data as fast as possible. With additional cost,
caching in API Gateway could also be used.
This approach also importantly isolates the user traffic from the core backend, meaning that it
doesn't have to account for user traffic at all, scaling-wise.

### Trending games:

Daily trending games are calculated with something like sliding windows. The average players in the
past 12 hours are compared to the average players in the same 12h window yesterday. So for example,
comparing the average players 12:30 - 00.30 yesterday vs 12:30 - 00.30 today. And every 30 mins the
windows move forward 30 mins, so the next time range is 13:00 - 01:00. The idea is to make the
trending games update every 30 minutes and not just once a day with some fixed time range.

### React Frontend & API:

Frontend features two tables. One presenting current, peak and bottom player counts for
each game. Another displaying the top 10 trending games. Frontend fetches the data from backend
through API Gateway, which is connected to two different Lambdas. One handling page and trending
data and the other one handling search queries. Caching of the data is used in the frontend. Every
response data is stored locally for some time and if requested again during this period, local cache
is used instead. So for example going forward and backward in the player count table will not request
the data again all the time. Prefetching next pages in the table is not implemented currently.

### Affiliate links:

Locally hosted program searches the game from a game marketplace and parses the html to find
the price and url of that game. This url is then combined with my personal referral code
(in the URL parameter) to create an affiliate link for games. These links are saved to RDS. \
Affiliate links can be shown as e.g. "Buy Here!" links next to the trending games but are
<strong>disabled currently. </strong>

### Continuous deployment:

Frontend is hosted in Amplify. When a code change is pushed into GitHub main branch, Amplify
builds and deploys the updated code.

### Costs and scalability:

As shown in the architecture there is a clear split between the backend, where the cost of the
core backend is always the same and independent of the user traffic. The client-facing backend
cost scales by the user traffic and it could be easily scaled to withstand a large amount of
users by increasing the concurrency of the two API Lambdas and if needed, the ElastiCache and
OpenSearch can both be scaled vertically with more powerful nodes and horizontally with more nodes.

## Future features:

1. The backend currently does not check the Steam API for new game releases
   but the system is made so that it is straightforward to implement. The
   needed addition is a Lambda that fetches new game IDs and names from
   Steam API and updates those to RDS and OpenSearch. This Lambda could be
   triggered by Stepfunction. Data processing is already implemented in a way that it works with new
   games that don't have e.g. Postgres table yet.
2. Admin panel that allows signing in with admin credentials to read and
   change data in the DB, and force start an update cycle anytime.
3. ~~Replace OpenSearch with something cheaper.~~
   - EC2 running Flask Server and Woosh as search engine replaced OpenSearch
