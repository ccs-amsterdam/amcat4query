import PaginationTable from "../components/PaginationTable";
import { useEffect, useMemo, useState } from "react";
import Article from "../Article/Article";
import { AmcatQuery, AmcatQueryResult, IndexProps } from "../interfaces";
import Amcat from "../apis/Amcat";

const per_page = 15;

interface ArticlesColumn {
  /** Object should have key 'name', which by default is both the column name in the table, and the value fetched from data. */
  name: string;
  /** Set to true to hide this column */
  hide?: boolean;
  /** Optional transformation function to run over the *row*  */
  f?: (row: any) => any;
  /** Optional 'width' to specify width in SemanticUIs 16 parts system. */
  width?: number;
}

const COLUMNS: ArticlesColumn[] = [
  { name: "_id", hide: true },
  { name: "date", f: (row) => row.date.replace("T", " ") },
  { name: "publisher" }, // optional
  { name: "title" },
  { name: "text" },
];

interface ArticlesProps extends IndexProps {
  /** Query/filter of which documents to show */
  query: AmcatQuery;
  /** an Array with objects indicating which columns to show and how */
  columns?: ArticlesColumn[];
  /** if true, include all columns AFTER the columns specified in the columns argument */
  allColumns?: boolean;
}

/**
 * Table overview of a subset of articles
 */
export default function Articles({
  amcat,
  index,
  query,
  columns = COLUMNS,
  allColumns = true,
}: ArticlesProps) {
  //TODO: add columns to meta OR retrieve fields (prefer the former) and pass the field types on to the table
  const [articleId, setArticleId] = useState(null);
  const [data, setData] = useState<AmcatQueryResult>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchArticles(amcat, index, query, page, true, setData);
  }, [amcat, index, query, page, setData]);

  const columnList = useMemo(() => {
    if (!data?.results || data.results.length === 0) return [];

    const dataColumns = Object.keys(data.results[0]);
    // first use the columns as specified in COLUMNS
    const columnList = columns.filter((c) => dataColumns.includes(c.name));
    // then add all other columns AFTER
    if (allColumns) {
      for (let name of dataColumns) {
        if (columnList.find((c) => c.name === name)) continue;
        columnList.push({ name });
      }
    }
    return columnList;
  }, [data, allColumns, columns]);

  const onClick = (row: any) => {
    setArticleId([row._id]);
  };

  return (
    <>
      <PaginationTable
        data={data?.results || []}
        columns={columnList}
        pages={data?.meta?.page_count || 0}
        pageChange={setPage}
        onClick={onClick}
      />
      <Article amcat={amcat} index={index} id={articleId} query={query} />
    </>
  );
}

const fetchArticles = async (
  amcat: Amcat,
  index: string,
  query: AmcatQuery,
  page: number,
  highlight: boolean,
  setData: (data: AmcatQueryResult) => void
) => {
  let params = { page, per_page, highlight };
  try {
    const res = await amcat.postQuery(index, query, params);
    setData(res.data);
  } catch (e) {
    console.log(e);
    setData(undefined);
  }
};
