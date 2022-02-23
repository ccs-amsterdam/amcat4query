import { useEffect, useState } from "react";
import { Button, Form, Grid, Header } from "semantic-ui-react";
import useFields, { getField } from "../Amcat";
import FilterPicker from "./FilterPicker";
import { QueryFormProps } from "./QueryForm";
import "./QueryForm.css";
import { AddFilterButton, fieldOptions } from "./SimpleQueryForm";

export default function MultilineQueryForm({ index, value, onSubmit }: QueryFormProps) {
  const fields = useFields(index);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (value?.queries) setQ(value.queries.join("\n"));
    else setQ("");
  }, [value?.queries]);
  if (!index || !fields) return null;
  function addFilter(name: string) {
    const filters = value?.filters || {};
    onSubmit({ ...value, filters: { ...filters, [name]: {} } });
  }
  function deleteFilter(name: string) {
    const f = { ...value.filters };
    delete f[name];
    console.log(f);
    onSubmit({ ...value, filters: f });
  }
  function handleKeyDown(event: any) {
    if (event.key === "Enter" && event.ctrlKey) {
      const queries = q.split("\n").filter((e) => e.trim() !== "");
      onSubmit({ ...value, queries: queries });
    }
  }

  return (
    <Grid className="multilinequery">
      <Grid.Column width={10}>
        <Form className="querycol">
          <b>Query:</b> (use control+Enter to submit)
          <br />
          <Form.TextArea
            rows={8}
            style={{ BorderRadius: "15px" }}
            placeholder={"Query (use control+Enter to submit)"}
            onChange={(_, { value }) => setQ(value as string)}
            onKeyDown={handleKeyDown}
            value={q || ""}
          />
        </Form>
      </Grid.Column>
      <Grid.Column width={6} className="filtercol">
        <b>Filters:</b>
        <br />
        <Grid>
          {Object.keys(value?.filters || {}).map((f, i) => (
            <Grid.Row key={i}>
              <Grid.Column width={2} verticalAlign="middle">
                {f}:
              </Grid.Column>
              <Grid.Column width={12}>
                <FilterPicker
                  circular
                  basic
                  fluid
                  key={i}
                  index={index}
                  field={getField(fields, f)}
                  value={value?.filters?.[f]}
                  onChange={(newval) =>
                    onSubmit({ ...value, filters: { ...value?.filters, [f]: newval } })
                  }
                />
              </Grid.Column>
              <Grid.Column width={2}>
                <Button icon="delete" circular onClick={() => deleteFilter(f)} />
              </Grid.Column>
            </Grid.Row>
          ))}
          <Grid.Row>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={14}>
              <AddFilterButton
                text=" &nbsp;&nbsp;Add Filter"
                options={fieldOptions(fields, value)}
                onClick={(field) => {
                  addFilter(field);
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>

      {/*<br />
      <Button primary content="Submit Query" />
      */}
    </Grid>
  );
}
