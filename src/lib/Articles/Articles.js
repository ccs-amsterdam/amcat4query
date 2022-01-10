import PaginationTable from "lib/components/PaginationTable";
import React, { useEffect, useMemo, useState } from "react";

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
 *                        taking a data row object as argument. Can also have key 'width' to specify width in SemanticUIs 16 parts system. * @returns
 * @param {bool}   allColumns If true, include all columns AFTER the columns specified in the columns argument
 */
export default function Articles({ amcat, index, query, columns = COLUMNS, allColumns = true }) {
  const [data, setPage] = useArticles(amcat, index, query);
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

  return (
    <PaginationTable
      data={data?.results || []}
      columns={columnList}
      pages={data?.meta?.page_count || 0}
      pageChange={setPage}
    />
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

  if (query.query_string) params.queries = query.query_string.split("\n");
  if (query?.params) params = { ...query.params, ...params };
  const filters = query.filters || {};

  try {
    const res = await amcat.postQuery(index, params, filters);
    setData(res.data);
  } catch (e) {
    console.log(e);
    setData([]);
  }
};

// const fetchArticle = async (amcat, index, _id, query) => {
//   try {
//     const res = await amcat.postQuery(
//       index,
//       { highlight: true, queries: ["shell", "alaska"] },
//       { _id }
//     );
//     console.log(res);
//   } catch (e) {
//     console.log(e);
//   }
// };
