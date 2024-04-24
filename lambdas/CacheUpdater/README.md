### Lambda Responsibility
Reads all the data needed by the client-side from the RDS and saves it to the ElastiCache for fetching (full cache invalidation).

Data saved to ElastiCache includes:
- current players as a sorted set (for page data) also as a key-value pair (for search feature)
- Daily trending games as a string
- Affiliate data as a string

##### **Succesful execution returns:**
{ statusCode: 200 }
##### **Unsuccesful execution returns:**
{ statusCode: 500, error: errorMessage }

### Version History
| Version | Changes |
| ------------- | ------------- |
| v5 | <ins>Changed:</ins> Use Environment Variables provided by the Lambda configuration. + Refactor |
| v4 | <ins>Added:</ins> Save current players to ElastiCache also as a key-value pair for the search feature |
| v3 | <ins>Added:</ins> Get affiliate data from RDS and save to ElastiCache |
| v2  | <ins>Added:</ins> Get daily trending games from RDS and save to ElastiCache  |
| v1  | Gets current players from RDS and saves to ElastiCache  |
