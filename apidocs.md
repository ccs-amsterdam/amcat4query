1. [Main components](#maincomponents)
1. [Aggregation](#aggregation)
1. [Articles](#articles)
1. [Login & Index](#login&index)
1. [Queries](#queries)

# Main components

## Login

Filename: [src/lib/Login/Login.tsx](src/lib/Login/Login.tsx)
  
```
An AmCAT login form.
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`onLogin` | (amcat: Amcat) => void | true | 


## Query

Filename: [src/lib/Query/Query.tsx](src/lib/Query/Query.tsx)
  
```
Specify a full AmCAT **query**, i.e. querystrings and filters
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`value` | [AmcatQuery](src/lib/interfaces.tsx#L36) | true | AmCAT query to be displayed, e.g. {"queries": [...], "filters": {...}}
`onSubmit` | (value: [AmcatQuery](src/lib/interfaces.tsx#L36)) => void | true | callback that will be called with a valid AmCAT query when the user clicks submit
`amcat` | Amcat | true | Amcat instance
`index` | string | true | index name


## Index

Filename: [src/lib/Index/Index.tsx](src/lib/Index/Index.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | 
`index` | string | true | 
`setIndex` | (index: string) => void | true | 
`canCreate` | boolean | true | 
`canDelete` | boolean | true | 


## AggregateResult

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
`query` | [AmcatQuery](src/lib/interfaces.tsx#L36) | true | The query for the results to show
`options` | [AggregationOptions](src/lib/interfaces.tsx#L12) | true | Aggregation options (display and axes information)
`amcat` | Amcat | true | Amcat instance
`index` | string | true | index name


## AggregateOptionsChooser

Filename: [src/lib/Aggregate/AggregateOptionsChooser.tsx](src/lib/Aggregate/AggregateOptionsChooser.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | 
`index` | string | true | 
`value` | [AggregationOptions](src/lib/interfaces.tsx#L12) | true | 
`onSubmit` | (value: [AggregationOptions](src/lib/interfaces.tsx#L12)) => void | true | 


## Article

Filename: [/home/wva/amcat4react/src/lib/Article/Article.tsx](/home/wva/amcat4react/src/lib/Article/Article.tsx)
  
```
Show a single article
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`id` | number \| [number] | true | An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change
`query` | [AmcatQuery](src/lib/interfaces.tsx#L36) | true | A query, used for highlighting
`amcat` | Amcat | true | Amcat instance
`index` | string | true | index name


## Articles

Filename: [/home/wva/amcat4react/src/lib/Articles/Articles.tsx](/home/wva/amcat4react/src/lib/Articles/Articles.tsx)
  
```
Table overview of a subset of articles
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`query` | [AmcatQuery](src/lib/interfaces.tsx#L36) | true | Query/filter of which documents to show
`columns` | PaginationTableColumn[] | false | an Array with objects indicating which columns to show and how
`allColumns` | boolean | false | if true, include all columns AFTER the columns specified in the columns argument
`amcat` | Amcat | true | Amcat instance
`index` | string | true | index name


# Aggregation

## AxisPicker

Filename: [src/lib/Aggregate/AxisPicker.tsx](src/lib/Aggregate/AxisPicker.tsx)
  
```
Dropdown to select an aggregation axis and possibly interval
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`fields` | Field[] | true | index fields to choose from
`value` | [AggregationAxis](src/lib/interfaces.tsx#L7) | true | Current axis value
`onChange` | (value: [AggregationAxis](src/lib/interfaces.tsx#L7)) => void | true | Callback to set axis when user changes field or interval
`label` | string | false | 


## AggregateTable

Filename: [src/lib/Aggregate/AggregateTable.tsx](src/lib/Aggregate/AggregateTable.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes


## AggregateLineChart

Filename: [src/lib/Aggregate/AggregateLineChart.tsx](src/lib/Aggregate/AggregateLineChart.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes


## AggregatePane

Filename: [src/lib/Aggregate/AggregatePane.tsx](src/lib/Aggregate/AggregatePane.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | 
`index` | string | true | 
`query` | [AmcatQuery](src/lib/interfaces.tsx#L36) | true | 


## AggregateBarChart

Filename: [/home/wva/amcat4react/src/lib/Aggregate/AggregateBarChart.tsx](/home/wva/amcat4react/src/lib/Aggregate/AggregateBarChart.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | AggregateData | true | *
The data to visualize
`onClick` | (value: any[]) => void | true | Callback when user clicks on a point,
should be an array of values of equal length to the # of axes


# Articles

## PaginationTable

Filename: [src/lib/components/PaginationTable.tsx](src/lib/components/PaginationTable.tsx)
  
```
A nice table with pagination
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`data` | TableRow[] | true | an Array with data for a single page
`columns` | PaginationTableColumn[] | true | an Array with objects indicating which columns to show and how.
`pages` | number | true | the number of pages
`pageChange` | (page: number) => void | true | the function to perform on pagechange. Gets pageindex as an argument, and should update data
`onClick` | (value: any) => void | true | Function to perform when clicking on a row. Gets data row object as argument


# Login & Index

## IndexCreate

Filename: [src/lib/Index/IndexCreate.tsx](src/lib/Index/IndexCreate.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | 
`open` | boolean | true | 
`onClose` | (name?: string) => void | true | 


## IndexDelete

Filename: [src/lib/Index/IndexDelete.tsx](src/lib/Index/IndexDelete.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | 
`index` | string | true | 
`open` | boolean | true | 
`onClose` | (deleted: boolean) => void | true | 


# Queries

## KeywordField

Filename: [src/lib/Query/KeywordField.tsx](src/lib/Query/KeywordField.tsx)
  
```
Field for creating a values/keyword filter
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | an AmCAT instance (to retrieve possible values)
`index` | string | true | the name of the current index
`field` | string | true | the field name of the current field
`value` | AmcatFilter | true | the current value of the filter, e.g. {"values": ["nrc"]}
`onChange` | (value: AmcatFilter) => void | true | callback that will be called with a new filter value


## Filters

Filename: [src/lib/Query/Filters.tsx](src/lib/Query/Filters.tsx)
  
```
Define the filters for a query
Props:
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`amcat` | Amcat | true | the AmCAT instance
`index` | string | true | name of the index
`value` | [AmcatFilters](src/lib/interfaces.tsx#L32) | true | the current filters, e.g. {"publisher": {"values": ["nrc"]}}
`onChange` | (value: [AmcatFilters](src/lib/interfaces.tsx#L32)) => void | true | Callback that will be called when the filter selection changes with a new filter object
  (note that the filter might be incomplete, i.e. have only a key and an empty body if the user is still selecting)


## DateField

Filename: [/home/wva/amcat4react/src/lib/Query/DateField.tsx](/home/wva/amcat4react/src/lib/Query/DateField.tsx)
  
```
Field for creating a date filter
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`field` | string | true | the field name of the current field
`value` | [DateFilter](src/lib/interfaces.tsx#L17) | true | the current value of the filter, e.g. {"gte": "2020-01-01"}
`onChange` | (value: [DateFilter](src/lib/interfaces.tsx#L17)) => void | true | callback that will be called with a new filter value


## FilterButton

Filename: [/home/wva/amcat4react/src/lib/Query/FilterButton.tsx](/home/wva/amcat4react/src/lib/Query/FilterButton.tsx)
  
```

```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`content` | any | true | 
`icon` | SemanticICONS | true | 
`field` | string | false | 
`disabled` | boolean | false | 
`onlyContent` | boolean | false | 
`style` | CSSProperties | false | 


## QueryString

Filename: [src/lib/Query/QueryString.tsx](src/lib/Query/QueryString.tsx)
  
```
Text area to set the query string(s)
props:
- value:
- onChange:
- rows: the number of rows (default: 7)
```
  
### Props:

Name | Type | Required | Descriptipn
--- | --- | --- | ---
`value` | string | true | the current value (query strings) as a single text
`onChange` | (value: string) => void | true | will be called on every change with a new textual value
`rows` | number | false | the number of rows (default: 7)
