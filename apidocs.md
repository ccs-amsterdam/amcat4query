# AggregateResult

Filename: [src/lib/Aggregate/AggregateResult.tsx](src/lib/Aggregate/AggregateResult.tsx)
  
```
Display the results of an aggregate search
props:
- amcat
- index
- query: an AmCAT query object {query, filters}
- options: aggregation options {display, axes}
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
query | AmcatQuery | true | The query for the results to show
options | AggregationOptions | true | Aggregation options (display and axes information)
amcat | Amcat | true | Amcat instance
index | string | true | index name
