import React, { useState, useEffect } from "react";
import useFields from "../components/useFields";
import prepareArticle from "./prepareArticle";
import { Grid, Label, Modal, Table } from "semantic-ui-react";
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
  let params = { annotations: true, filters: { _id } };
  if (query?.queries) params.queries = query.queries;
  try {
    const res = await amcat.postQuery(index, params);
    console.log(res);
    setArticle(res.data.results[0]);
  } catch (e) {
    console.log(e);
    setArticle(null);
  }
};

const Body = ({ article, fields }) => {
  const fieldLayout = {
    title: { fontSize: "1.4em", fontWeight: "bold" },
    text: {},
    default: {},
  };

  article = prepareArticle(article);

  // Add title, all other 'text' fields, and finally text
  const texts = [formatTextField(article, "title", fieldLayout)];
  fields
    .filter((f) => f.type === "text" && !["title", "text"].includes(f.name) && article[f.name])
    .forEach((f) => {
      texts.push(formatTextField(article, f.name, fieldLayout, true));
    });

  texts.push(formatTextField(article, "text", fieldLayout, texts.length > 1));
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
  const metaFields = fields.filter((f) => f.type !== "text" && !["title", "text"].includes(f.name));
  const rows = () => {
    return metaFields.map((field) => {
      const value = formatMetaValue(article, field);

      return (
        <Table.Row key={field.name}>
          <Table.Cell width={1}>
            <b>{field.name}</b>
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

/**
 * Format a meta field for presentation
 * @param {*} article
 * @param {*} field
 * @returns
 */
const formatMetaValue = (article, field) => {
  const value = article[field.name];
  switch (field.type) {
    case "date":
      // Only remove 'T' for now. But not sure why that's a great idea
      return value.replace("T", " ");
    case "url":
      return <a href={value}>{value}</a>;
    case "tag":
      if (Array.isArray(value)) return value.map((v) => <Label>{v}</Label>);
      else return value;
    default:
      return value;
  }
};
