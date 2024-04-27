### RETIRED!
This Lambda is not used anymore. It was used at the start of the project to get some rough prioritizing for the games and update only the most important ones. 

### Lambda Responsibility
Gets unprioritized (-1) games from RDS, fetches their current player count and updates priority accordingly.

#### CONSTANTS
Priorities are updated by the current player count according to this:
| Player count | New priority |
| ------------- | ------------- |
| > 2000 | 1 |
| > 250 | 2 |
| > 25 | 3 |
| >= 0 | 4 |
| No player count available | 0 |

##### **Succesful execution returns:**
Nothing.

##### **Unsuccesful execution returns:**
Nothing.

##### Possible reasons for unsuccesful execution:
- Connection problem with RDS
- Connection problem with Steam API

### Version History
| Version | Changes |
| ------------- | ------------- |
| v1  | Gets unprioritized (-1) games from RDS, fetches their current player count and updates priority accordingly. |
