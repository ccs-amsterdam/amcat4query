import React, { useState, useEffect } from "react";
import useFields from "../components/useFields";
import addAnnotations from "./addAnnotations";
import { Grid, Modal, Table } from "semantic-ui-react";
import "./articleStyle.css";

/**
 *
 * @param {class}  amcat  An Amcat connection class, as obtained with amcat4auth
 * @param {string} index The name of an index
 * @param {array}  id     An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't chagne.
 * @param {array}  columns an Array with objects indicating which columns to show and how. Object should have key 'name', which by default
 *                        is both the column name in the table, and the value fetched from data. But can also have a key 'f', which is a function
 *                        taking a data row object as argument. Can also have key 'width' to specify width in SemanticUIs 16 parts system.
 * @returns
 */
export default function Article({ amcat, index, id, query }) {
  const fields = useFields(amcat, index);
  const [article, setArticle] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const _id = Array.isArray(id) ? id[0] : id;
    if (article && _id === article._id) return;
    fetchArticle(amcat, index, _id, query, setArticle);
  }, [id, article, amcat, index, query]);

  useEffect(() => {
    setOpen(true);
  }, [id]);

  if (!article || !fields) return null;
  return (
    <Modal open={open} onClose={() => setOpen(false)} style={{ width: "80vw", maxWidth: "1200px" }}>
      <Modal.Header></Modal.Header>
      <Modal.Content scrolling>
        <Modal.Description style={{ height: "100%" }}>
          <Grid stackable>
            <Grid.Column width={6}>
              <Meta article={article} fields={fields} />
            </Grid.Column>
            <Grid.Column width={10}>
              <Body article={article} fields={fields} />
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>

      <Modal.Actions></Modal.Actions>
    </Modal>
  );
}

const fetchArticle = async (amcat, index, _id, query, setArticle) => {
  let params = { annotations: true };
  if (query.query_string) params.queries = query.query_string.split("\n").filter((s) => s !== "");
  try {
    const res = await amcat.postQuery(index, params, { _id });
    console.log(res.data.results[0]);
    setArticle(res.data.results[0]);
  } catch (e) {
    console.log(e);
    setArticle(null);
  }
};

const Body = ({ article }) => {
  const fieldLayout = {
    title: { fontSize: "1.4em", fontWeight: "bold" },
    text: {},
    default: {},
  };

  article = addAnnotations(article);

  const texts = [
    formatTextField(article, "title", fieldLayout),
    formatTextField(article, "text", fieldLayout),
  ];

  // Disabled for now, but we could decide to show more (text type) fields in the body
  // for (const field of Object.keys(fields)) {
  //   if (field === "title" || field === "text") continue;
  //   if (fields[field] !== "text") continue;
  //   if (!article[field]) continue;
  //   texts.push(formatTextField(article, field, fieldLayout, true));
  // }

  return texts;
};

const formatTextField = (article, field, layout, label) => {
  //const paragraphs = article[field].split("\n");
  const paragraphs = [article[field]];

  const addLabel = () => {
    if (!label) return null;
    return (
      <span
        key={field + "_label"}
        style={{
          color: "grey",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {field}
      </span>
    );
  };

  const fieldLayout = layout[field] || layout.default;

  return (
    <div key={field} style={{ paddingBottom: "1em" }}>
      {addLabel()}
      {paragraphs.map((p, i) => (
        <p key={field + "_" + i} style={{ ...fieldLayout }}>
          {p}
        </p>
      ))}
    </div>
  );
};

const Meta = ({ article, fields }) => {
  const metaFields = Object.keys(fields).reduce((mf, field) => {
    if (field === "title" || field === "text") return mf;
    if (!article[field]) return mf;
    mf.push(field);
    return mf;
  }, []);

  const rows = () => {
    return metaFields.map((field) => {
      const value = formatMetaValue(article[field]);

      return (
        <Table.Row key={field}>
          <Table.Cell width={1}>
            <b>{field}</b>
          </Table.Cell>
          <Table.Cell>{value}</Table.Cell>
        </Table.Row>
      );
    });
  };

  if (metaFields.length === 0) return null;

  return (
    <Table
      basic="very"
      compact
      style={{
        lineHeight: "0.9",
        padding: "10px",
        paddingLeft: "10px",
        color: "black",
      }}
    >
      {rows()}
    </Table>
  );
};

const formatMetaValue = (value) => {
  //   try if value is a date, if so, format accordingly
  //   Only remove T if time for now. Complicated due to time zones.
  const dateInt = Date.parse(value);
  if (dateInt) {
    return value.replace("T", " ");
  }
  return value;
};
