import { List } from "semantic-ui-react";
import { formatMetaValue } from "../Article/Article";
import { AmcatDocument } from "../interfaces";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { PaginationFooter, PaginationProps, PaginationTableColumn } from "./PaginationTable";

function snippetText(row: AmcatDocument) {
  const text = row.text as string;
  if (row.text.includes("<em>")) return highlightElasticTags(text);
  return text.substring(0, 100) + "...";
}

export default function ArticleSnippets({
  data,
  columns,
  pages,
  pageChange,
  onClick,
}: PaginationProps) {
  const meta = (row: any) => {
    return columns
      .filter((c) => !["_id", "title", "text"].includes(c.name))
      .map((c) => formatMetaValue(row, c))
      .join(" - ");
  };
  return (
    <>
      <List divided relaxed>
        {data.map((row, i) => (
          <List.Item key={i}>
            <List.Content>
              <List.Header as="a" onClick={() => onClick(row)}>
                <span title={removeElasticTags(row.title)}>{highlightElasticTags(row.title)}</span>
              </List.Header>
              {snippetText(row)}
              <List.Description as="a">{meta(row)}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <PaginationFooter pages={pages} pageChange={pageChange} />
    </>
  );
}
