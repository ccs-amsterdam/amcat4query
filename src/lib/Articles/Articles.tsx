import PaginationTable, { PaginationTableColumn } from "./PaginationTable";
import ArticleSnippets from "./ArticleSnippets";
import { useEffect, useMemo, useState } from "react";
import Article from "../Article/Article";
import { AmcatIndex, AmcatQuery, AmcatQueryResult, SortSpec } from "../interfaces";
import { getField, postQuery, useFields } from "../Amcat";

const COLUMNS: PaginationTableColumn[] = [
  { name: "_id", type: "id", hide: true },
  { name: "date", type: "date", f: (row) => row.date.replace("T", " ") },
  { name: "publisher", type: "keyword" }, // optional
  { name: "title", type: "text" },
  { name: "text", type: "text" },
];

export interface ArticlesProps {
  index: AmcatIndex;
  /** Query/filter of which documents to show */
  query: AmcatQuery;
  /** an Array with objects indicating which columns to show and how */
  columns?: PaginationTableColumn[];
  /** if true, include all columns AFTER the columns specified in the columns argument */
  allColumns?: boolean;
  /** if true, show results as snippets rather than as table */
  asSnippets?: boolean;
  /** Number of articles per page */
  perPage?: number;
  /** How to sort results */
  sort?: SortSpec;
  onSortChange?: (sort: SortSpec) => void;
}

/**
 * Table overview of a subset of articles
 */
export default function Articles({
  index,
  query,
  columns = COLUMNS,
  allColumns = true,
  asSnippets = false,
  perPage = 15,
  sort,
}: ArticlesProps) {
  //TODO: add columns to meta OR retrieve fields (prefer the former) and pass the field types on to the table
  const [articleId, setArticleId] = useState(null);
  const [data, setData] = useState<AmcatQueryResult>();
  const [page, setPage] = useState(0);
  const [currentSort, setCurrentSort] = useState(sort);

  useEffect(() => {
    const highlight: any = asSnippets ? { number_of_fragments: 3 } : true;
    fetchArticles(index, query, page, highlight, perPage, currentSort, setData);
  }, [index, query, page, setData, asSnippets, perPage, currentSort]);
  const fields = useFields(index);
  const columnList = useMemo(() => {
    if (!data?.results || data.results.length === 0) return [];

    const dataColumns = Object.keys(data.results[0]);
    // first use the columns as specified in COLUMNS
    const columnList = columns.filter((c) => dataColumns.includes(c.name));
    // then add all other columns AFTER
    if (allColumns) {
      for (let name of dataColumns) {
        if (columnList.find((c) => c.name === name)) continue;
        const field = getField(fields, name);
        if (field != null) columnList.push(field);
      }
    }
    return columnList;
  }, [data, allColumns, columns, fields]);

  if (!fields) return null;

  const onClick = (row: any) => {
    setArticleId([row._id]);
  };
  return (
    <>
      {asSnippets ? (
        <ArticleSnippets
          data={data?.results || []}
          columns={columnList}
          pages={data?.meta?.page_count || 0}
          pageChange={setPage}
          onClick={onClick}
        />
      ) : (
        <PaginationTable
          data={data?.results || []}
          columns={columnList}
          pages={data?.meta?.page_count || 0}
          pageChange={setPage}
          onClick={onClick}
          sort={currentSort}
          onSortChange={setCurrentSort}
        />
      )}
      <Article index={index} id={articleId} query={query} changeArticle={setArticleId} />
    </>
  );
}

async function fetchArticles(
  index: AmcatIndex,
  query: AmcatQuery,
  page: number,
  highlight: boolean,
  perPage: number,
  sort: any,
  setData: (data: AmcatQueryResult) => void
) {
  let params = { page, highlight, per_page: perPage, sort };
  try {
    const res = await postQuery(index, query, params);
    setData(res.data);
  } catch (e) {
    console.log(e);
    setData(undefined);
  }
}
