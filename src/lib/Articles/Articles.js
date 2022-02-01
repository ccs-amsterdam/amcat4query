import PaginationTable from "../components/PaginationTable";
import React, { useEffect, useMemo, useState } from "react";
import Article from "../Article/Article";

const per_page = 15;

const COLUMNS = [
  { name: "_id", hide: true },
  { name: "date", f: (row) => row.date.replace("T", " "), width: "8em" },
  { name: "publisher", width: "6em" }, // optional
  { name: "title" },
  { name: "text" },
];

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {object} query An object with query components (q, params, filter)
 * @param {array}  columns an Array with objects indicating which columns to show and how. Object should have key 'name', which by default
 *                        is both the column name in the table, and the value fetched from data. But can also have a key 'f', which is a function
 *                        taking a data row object as argument. Can also have key 'width' to specify width in SemanticUIs 16 parts system.
 * @param {bool}   allColumns If true, include all columns AFTER the columns specified in the columns argument
 * @returns
 */
export default function Articles({ amcat, index, query, columns = COLUMNS, allColumns = true }) {
  const [data, setPage] = useArticles(amcat, index, query);
  const [articleId, setArticleId] = useState(null);
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

  const onClick = (row) => {
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

const useArticles = (amcat, index, query) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchArticles(amcat, index, query, page, true, setData);
  }, [amcat, index, query, page, setData]);

  return [data, setPage];
};

const fetchArticles = async (amcat, index, query, page, highlight, setData) => {
  let params = { page, per_page, highlight };
  try {
    const res = await amcat.postQuery(index, query, params);
    console.log(res.data);
    setData(res.data);
  } catch (e) {
    console.log(e);
    setData([]);
  }
};
