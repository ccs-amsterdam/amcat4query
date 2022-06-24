import { useEffect, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useFields, getField } from "../Amcat";
import FilterPicker from "./FilterPicker";
import { QueryFormProps } from "./QueryForm";
import "./QueryForm.scss";
import { AddFilterButton, fieldOptions } from "./SimpleQueryForm";
import {queryFromString, queryToString} from "./libQuery";

export default function MultilineQueryForm({ index, value, onSubmit }: QueryFormProps) {
  const fields = useFields(index);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (value?.queries) setQ(queryToString(value.queries));
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
      console.log({q, queries: queryFromString(q)})
      onSubmit({ ...value, queries: queryFromString(q) });
    }
  }
  const hint = "(use control+Enter to submit; label queries with label=query)";
  return (
    <div className="multilinequery">
      <Form className="querycol">
        <b>Query:</b> {hint}
        <br />
        <Form.TextArea
          rows={8}
          style={{ BorderRadius: "15px" }}
          placeholder={hint}
          onChange={(_, { value }) => setQ(value as string)}
          onKeyDown={handleKeyDown}
          value={q || ""}
        />
      </Form>
      <div className="filtercol">
        <b>Filters:</b>
        <br />
        <div className="filterlist">
          {Object.keys(value?.filters || {}).map((f, i) => (
            <div className="filter" key={i}>
              <div className="filterlabel">{f}:</div>
              <div className="filterpicker">
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
              </div>
              <div className="filterdelete">
                <Button icon="delete" circular onClick={() => deleteFilter(f)} />
              </div>
            </div>
          ))}
          <div className="filter">
            <div className="filterlabel"></div>
            <div className="filterpicker">
              <AddFilterButton
                options={fieldOptions(fields, value)}
                onClick={(field) => {
                  addFilter(field);
                }}
              />
            </div>
          </div>
        </div>

        {/*<br />
      <Button primary content="Submit Query" />
      */}
      </div>
    </div>
  );
}
