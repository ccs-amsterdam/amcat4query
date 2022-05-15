import { useState } from "react";
import { Form } from "semantic-ui-react";
import { Articles } from "../lib";
import { getFieldTypeIcon, useFields } from "../lib/Amcat";
import { ArticlesProps } from "../lib/Articles/Articles";

export default function ArticlesPane({ index, query }: ArticlesProps) {
  const [useSnippets, setUseSnippets] = useState<boolean>();
  const [perPage, setPerPage] = useState<number>();
  const [sort, setSort] = useState<string>();
  const [sortdesc, setSortdesc] = useState(false);
  const fields = useFields(index);
  const sortopt =
    sort == null || sort == "" ? undefined : [{ [sort]: { order: sortdesc ? "desc" : "asc" } }];
  if (!index) return null;
  const sortfields = fields
    .filter((f) => ["date", "keyword", "tag", "long"].includes(f.type))
    .map((f) => ({
      key: f.name,
      value: f.name,
      text: f.name,
      icon: getFieldTypeIcon(f.type),
    }));
  return (
    <>
      <Form>
        <Form.Group inline>
          <Form.Checkbox
            label="Output as snippets?"
            checked={useSnippets}
            onChange={(_, { checked }) => setUseSnippets(checked)}
          />
          <Form.Input
            type="number"
            label="#Documents per page"
            value={perPage || ""}
            onChange={(_, { value }) => setPerPage(parseInt(value))}
          />
          Sort:
          <Form.Dropdown
            clearable
            selection
            value={sort}
            options={sortfields}
            onChange={(_, { value }) => setSort(value as string)}
          />
          Descending?
          <Form.Checkbox checked={sortdesc} onChange={(_, { checked }) => setSortdesc(checked)} />
        </Form.Group>
      </Form>
      <Articles
        index={index}
        query={query}
        asSnippets={useSnippets}
        allColumns={!useSnippets}
        perPage={perPage}
        sort={sortopt as any}
      />
    </>
  );
}
