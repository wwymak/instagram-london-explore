Some mongo queries to expore the data from the subset with the image analysis:

These are the top locations:
```
db.posts20160911.aggregate([{$group:{ _id: {'locationID' : '$location.id', 'name': '$location.name'}, count:{$sum: 1}}},{$sort: {count:-1}},{$limit: 10}])

{ "_id" : { "locationID" : 213385402, "name" : "London, United Kingdom" }, "count" : 298 }
{ "_id" : { "locationID" : 21911, "name" : "Wembley Stadium" }, "count" : 230 }
{ "_id" : { "locationID" : 230884974, "name" : "Harry Potter Studio Tour at Warner Brothers Studios" }, "count" : 229 }
{ "_id" : { "locationID" : 215717774, "name" : "Victoria Park" }, "count" : 189 }
{ "_id" : { "locationID" : 228474295, "name" : "Disneyland, Paris" }, "count" : 165 }
{ "_id" : { "locationID" : 261635, "name" : "Alexandra Palace" }, "count" : 154 }
{ "_id" : { "locationID" : 594107096, "name" : "Santorini, Greece" }, "count" : 151 }
{ "_id" : { "locationID" : 518090644, "name" : "Piccadilly Circus - London" }, "count" : 140 }
{ "_id" : { "locationID" : 215385307, "name" : "Kew Gardens" }, "count" : 138 }
{ "_id" : { "locationID" : 228331733, "name" : "OnBlackheath" }, "count" : 131 }
```

Obviously there are a few issues with certain locations, e.g. Disney, Santirini shouldn't be in 
the London data at all, and the top one is probably for any photos not tagged with a specific location
