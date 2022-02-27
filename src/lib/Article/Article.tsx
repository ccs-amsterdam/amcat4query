import { useState, useEffect } from "react";
import { useFields } from "../Amcat";
import prepareArticle from "./prepareArticle";
import { Grid, Label, Modal, Table } from "semantic-ui-react";
import "./articleStyle.css";
import { AmcatDocument, AmcatField, AmcatQuery, AmcatIndex } from "../interfaces";
import { addFilter, postQuery } from "../Amcat";

interface ArticleProps {
  index: AmcatIndex;
  /** An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change */
  id: number | [number];
  /** A query, used for highlighting */
  query: AmcatQuery;
}

/**
 * Show a single article
 */
export default function Article({ index, id, query }: ArticleProps) {
  const fields = useFields(index);
  const [article, setArticle] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!id) return;
    const _id = Array.isArray(id) ? id[0] : id;
    if (article && _id === article._id) return;
    fetchArticle(index, _id, query, setArticle);
  }, [id, article, index, query]);

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

function fetchArticle(
  index: AmcatIndex,
  _id: number,
  query: AmcatQuery,
  setArticle: (value: AmcatDocument) => void
) {
  let params: any = { annotations: true };
  query = addFilter(query, { _id: { values: [_id] } });
  postQuery(index, query, params)
    .then((data) => {
      setArticle(data.data.results[0]);
    })
    .catch((error) => {
      console.log(error);
      setArticle(null);
    });
}

interface BodyProps {
  article: AmcatDocument;
  fields: AmcatField[];
}

const Body = ({ article, fields }: BodyProps) => {
  const fieldLayout = {
    title: { fontSize: "1.4em", fontWeight: "bold" },
    text: {},
    default: {},
  };

  article = prepareArticle(article);

  // Add title, all other 'text' fields, and finally text
  const texts = [<TextField key={-1} article={article} field="title" layout={fieldLayout} />];
  fields
    .filter((f) => f.type === "text" && !["title", "text"].includes(f.name) && article[f.name])
    .forEach((f, i) => {
      texts.push(
        <TextField key={i} article={article} field={f.name} layout={fieldLayout} label={true} />
      );
    });

  texts.push(
    <TextField
      key={-2}
      article={article}
      field="text"
      layout={fieldLayout}
      label={texts.length > 1}
    />
  );
  return <>{texts}</>;
};

interface TextFieldProps {
  article: AmcatDocument;
  field: string;
  layout: any;
  label?: boolean;
}

function TextField({ article, field, layout, label }: TextFieldProps) {
  //const paragraphs = article[field].split("\n");
  let paragraphs = [article[field]];
  const fieldLayout = layout[field] || layout.default;
  return (
    <div key={field} style={{ paddingBottom: "1em" }}>
      {!label ? null : (
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
      )}
      {paragraphs.map((p: any, i: number) => (
        <p key={`${field}_${i}`} style={fieldLayout}>
          {p}
        </p>
      ))}
    </div>
  );
}

const Meta = ({ article, fields }: BodyProps) => {
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
      <Table.Body>{rows()}</Table.Body>
    </Table>
  );
};

/**
 * Format a meta field for presentation
 * @param {*} article
 * @param {*} field
 * @returns
 */
const formatMetaValue = (article: AmcatDocument, field: AmcatField) => {
  const value = article[field.name];
  switch (field.type) {
    case "date":
      // Only remove 'T' for now. But not sure why that's a great idea
      return value.replace("T", " ");
    case "url":
      return <a href={value}>{value}</a>;
    case "tag":
      if (Array.isArray(value)) return value.map((v) => <Label>{v}</Label>);
      else return value ? <Label>{value}</Label> : null;
    case "long":
    case "double":
      return <i>{value}</i>;
    default:
      if (typeof value === "string") return value;
      return JSON.stringify(value);
  }
};
