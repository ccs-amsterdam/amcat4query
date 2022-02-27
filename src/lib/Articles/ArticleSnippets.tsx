import { List } from "semantic-ui-react";
import { highlightElasticTags, removeElasticTags } from "./highlightElasticTags";
import { PaginationFooter, PaginationProps, PaginationTableColumn } from "./PaginationTable";

export default function ArticleSnippets({
  data,
  columns,
  pages,
  pageChange,
  onClick,
}: PaginationProps) {
  const metavalue = (row: any, column: PaginationTableColumn) => {
    const val = row[column.name];
    if (val && column.f) return column.f(row);
    return val;
  };
  const meta = (row: any) => {
    return columns
      .filter((c) => !["_id", "title", "text"].includes(c.name))
      .map((c) => metavalue(row, c))
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
              {row.text.includes("<em>")
                ? highlightElasticTags(row.text)
                : row.text.substring(0, 100) + "..."}
              <List.Description as="a">{meta(row)}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
      <PaginationFooter pages={pages} pageChange={pageChange} />
    </>
  );
}
