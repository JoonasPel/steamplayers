### RETIRED!
##### Reason: Elasticache used instead of this Lambda.

Before Elasticache, this created separate page data tables so that frontend request could read it from RDS without indexing, ordering etc. 
For example, if page 7 data was needed, simply read table "page_7".

Every update cycle recreated all tables because the items inside tables might change. e.g. a game in page_7 table might have less players later and be in page_8 table.
