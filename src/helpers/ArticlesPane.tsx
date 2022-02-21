import { useState } from "react";
import { Form } from "semantic-ui-react";
import { Articles } from "../lib";
import { ArticlesProps } from "../lib/Articles/Articles";

export default function ArticlesPane({ index, query }: ArticlesProps) {
  const [useSnippets, setUseSnippets] = useState<boolean>();
  const [perPage, setPerPage] = useState<number>();

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
        </Form.Group>
      </Form>
      <Articles
        index={index}
        query={query}
        asSnippets={useSnippets}
        allColumns={!useSnippets}
        perPage={perPage}
      />
    </>
  );
}
