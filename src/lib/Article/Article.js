import React, { useState, useEffect } from "react";
import useFields from "../components/useFields";
import { Modal } from "semantic-ui-react";

export default function Article({ amcat, index, id, query }) {
  const fields = useFields(amcat, index);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    if (!id || !fields) return;
    fetchArticle(amcat, index, id, query, fields, setArticle);
  }, [id, fields, amcat, index, query]);

  console.log(article);
  if (!article) return null;
  console.log("what");
  return <Modal open>{article}</Modal>;
}

const fetchArticle = async (amcat, index, _id, query, fields, setArticle) => {
  let params = { annotations: true };
  if (query.query_string) params.queries = query.query_string.split("\n");
  try {
    const res = await amcat.postQuery(index, params, { _id });
    setArticle(formatArticle(res.data.results[0], fields));
  } catch (e) {
    console.log(e);
    setArticle(null);
  }
};

const formatArticle = (article, fields) => {
  const texts = [];
  for (const key of Object.keys(fields)) {
    if (fields[key] !== "text") continue;
    if (!article[key]) continue;
    const paragraphs = article[key].split("\n");
    const field = (
      <div key={key} style={{ paddingBottom: "1em" }}>
        <span
          key={key + "_label"}
          style={{
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {key}
        </span>
        {paragraphs.map((p, i) => (
          <p key={key + "_" + i}>{p}</p>
        ))}
      </div>
    );
    texts.push(field);
  }

  return texts;
};
