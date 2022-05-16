import { useEffect, useState } from "react";
import { Button, Icon, Input, Popup } from "semantic-ui-react";
import { AmcatField } from "..";
import { useFields, getField, getFieldTypeIcon } from "../Amcat";
import { AmcatQuery } from "../interfaces";
import FilterPicker from "./FilterPicker";
import { QueryFormProps } from "./QueryForm";
import "./QueryForm.scss";

export function fieldOptions(fields: AmcatField[], query: AmcatQuery) {
  return fields
    .filter((f) => !Object.keys(query?.filters || {}).includes(f.name))
    .filter((f) => ["date", "keyword"].includes(f.type));
}

export default function SimpleQueryForm({ index, value, onSubmit }: QueryFormProps) {
  const fields = useFields(index);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!value?.queries || value.queries.length === 0) setQ("");
    else setQ(value.queries.join("; "));
  }, [value?.queries]);

  if (!index || !fields) return null;

  function deleteFilter(name: string) {
    const f = { ...value.filters };
    delete f[name];
    onSubmit({ ...value, filters: f });
  }
  function addFilter(name: string) {
    const filters = value?.filters || {};
    onSubmit({ ...value, filters: { ...filters, [name]: {} } });
  }
  function handleKeydown(e: any) {
    if (e.key === "Enter")
      onSubmit({
        ...value,
        queries:
          q === ""
            ? []
            : q
                .split(";")
                .map((x) => x.trim())
                .filter((e) => e !== ""),
      });
  }

  return (
    <div className="singlequeryform">
      <Input
        icon="search"
        iconPosition="left"
        className="querystring"
        placeholder="search"
        value={q}
        onChange={(_, { value }) => setQ(value)}
        onKeyDown={handleKeydown}
      />

      {Object.keys(value?.filters || {}).map((f, i) => (
        <FilterPicker
          basic
          circular
          key={i}
          index={index}
          field={getField(fields, f)}
          value={value?.filters?.[f]}
          onChange={(newval) => onSubmit({ ...value, filters: { ...value?.filters, [f]: newval } })}
          onDelete={() => deleteFilter(f)}
        />
      ))}
      <AddFilterButton options={fieldOptions(fields, value)} onClick={addFilter} />
    </div>
  );
}

interface AddFilterProps {
  options: AmcatField[];
  onClick: (value: string) => void;
}
export function AddFilterButton({ options, onClick }: AddFilterProps) {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <Popup
      open={addOpen}
      onOpen={() => setAddOpen(true)}
      onClose={() => setAddOpen(false)}
      on="click"
      trigger={
        <Button primary circular>
          <Icon.Group>
            <Icon name="filter" />
            <Icon corner name="add" color="blue" />
          </Icon.Group>
          <span className="addfiltertext">Add Filter</span>
        </Button>
      }
    >
      <b>new filter</b>
      <br />
      <Button.Group basic vertical>
        {options.map((f) => (
          <Button
            key={f.name}
            icon
            labelPosition="left"
            onClick={() => {
              setAddOpen(false);
              onClick(f.name);
            }}
          >
            <Icon name={getFieldTypeIcon(f.type)} />
            {f.name}
          </Button>
        ))}
      </Button.Group>
    </Popup>
  );
}
