import PaginationTable from "lib/components/PaginationTable";
import React, { useEffect, useState } from "react";

const per_page = 15;

export default function AmcatArticles({ amcat, index, query }) {
  const [data, setPage] = useQuery(amcat, index, query);

  return (
    <PaginationTable
      data={data?.results || []}
      pages={data?.meta?.page_count || 0}
      pageChange={setPage}
    />
  );
}

const useQuery = (amcat, index, query) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchArticles(amcat, index, query, page, setData);
  }, [amcat, index, query, page, setData]);

  return [data, setPage];
};

const fetchArticles = async (amcat, index, query, page, setData) => {
  try {
    const res = await amcat.getQuery(index, { page, per_page });
    console.log(res);
    setData(res.data);
  } catch (e) {
    console.log(e);
    console.log(e.message);
  }
};
