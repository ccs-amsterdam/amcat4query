import { useEffect, useState } from "react";
import { Grid, Icon, Label, Popup, Table } from "semantic-ui-react";
import { addFilter, postQuery, useFields } from "../Amcat";
import { AmcatDocument, AmcatField, AmcatIndex, AmcatQuery } from "../interfaces";
import "./articleStyle.css";
import prepareArticle from "./prepareArticle";

export interface ArticleProps {
  index: AmcatIndex;
  /** An article id. Can also be an array of length 1 with the article id, which can trigger setOpen if the id didn't change */
  id: string | [string];
  /** A query, used for highlighting */
  query: AmcatQuery;
  changeArticle?: (id: number) => void;
  link?: string;
}

export default function Article({ index, id, query, changeArticle, link }: ArticleProps) {
  const fields = useFields(index);
  const [article, setArticle] = useState(null);
  useEffect(() => {
    if (!id) return;
    const _id = Array.isArray(id) ? id[0] : id;
    if (article && _id === article._id) return;
    fetchArticle(index, _id, query, setArticle);
  }, [id, article, index, query]);
  if (!article || !fields) return null;

  return (
    <Grid stackable>
      <Grid.Column width={6}>
        <Meta article={article} fields={fields} setArticle={changeArticle} link={link} />
      </Grid.Column>
      <Grid.Column width={10}>
        <Body article={article} fields={fields} />
      </Grid.Column>
    </Grid>
  );
}

function fetchArticle(
  index: AmcatIndex,
  _id: string,
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
  setArticle?: (id: number) => void;
  link?: string;
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

const Meta = ({ article, fields, setArticle, link }: BodyProps) => {
  const metaFields = fields.filter(
    (f) =>
      f.type !== "text" &&
      !["title", "text"].includes(f.name) &&
      f.meta?.amcat4_display_meta !== "0"
  );
  const rows = () => {
    return metaFields.map((field) => {
      const value = formatMetaValue(article, field, setArticle);
      if (value == null) return null;
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

  const abbreviate = function (text: string | number) {
    const t = text.toString();
    if (t.length > 10) return `${t.substring(0, 4)}...${t.substring(t.length - 4)}`;
    return t;
  };

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
      <Table.Body>
        {link == null ? null : (
          <Table.Row key={-1}>
            <Table.Cell width={1}>
              <b>AmCAT ID</b>
            </Table.Cell>
            <Table.Cell>
              <Popup
                inverted
                trigger={
                  <a
                    href={link}
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard.writeText(link);
                      return false;
                    }}
                  >
                    {abbreviate(article._id)}
                  </a>
                }
                content="Link copied to clipboard!"
                on="click"
              />
            </Table.Cell>
          </Table.Row>
        )}
        {rows()}
      </Table.Body>
    </Table>
  );
};

/**
 * Format a meta field for presentation
 * @param {*} article
 * @param {*} field
 * @returns
 */
export const formatMetaValue = (
  article: AmcatDocument,
  field: AmcatField,
  setArticle?: (id: number) => void
) => {
  const value = article[field.name];
  if (value == null) return null;
  switch (field.type) {
    case "date":
      // Only remove 'T' for now. But not sure why that's a great idea
      return value.replace("T", " ").substring(0, 19);
    case "id":
      return <Icon link name="linkify" onClick={() => setArticle(value)} />;
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
