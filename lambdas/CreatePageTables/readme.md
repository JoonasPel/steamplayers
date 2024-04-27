### RETIRED!
Before ElastiCache, this Lambda created separate page data tables so that frontend request could read it from RDS without indexing, ordering etc. 
For example, if page 7 data was needed, simply read table "page_7".

Every update cycle recreated all tables because the items inside tables might change. e.g. a game in page_7 table might have less players later and be in page_8 table. 

#### CONSTANTS
| Name | Value | Description |
| ------------- | ------------- | ------------- |
| HOWMANYGAMESPERPAGE | 10 | How many games are in single page. |

#### Possible improvements
Use Environment Variables.

##### **Succesful execution returns:**
```json
{
  "statusCode": 200,
}
```

##### **Unsuccesful execution returns:**
```json
{
  "statusCode": 500,
  "error": "ERROR MESSAGE"
}
```

##### Possible reasons for unsuccesful execution:
- Connection problem with RDS

### Version History
| Version | Changes |
| ------------- | ------------- |
| v1  | Divide games to separate page tables. |
