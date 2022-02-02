import React from "react";
import { Button, Dropdown } from "semantic-ui-react";
import useFields from "../components/useFields";
import FilterButton from "./FilterForms/FilterButton";
import KeywordField from "./FilterForms/KeywordField";
import DateField from "./FilterForms/DateField";

/**
 *
 * Define the filters for a query
 * Props:
 * - amcat: the AmCAT instance
 * - index (str): name of the index
 * - value (dict): the current filters, e.g. {"publisher": {"values": ["nrc"]}}
 * - onChange: will be called when the filter selection changes with a new filter object
 *             (note that the filter might be incomplete, i.e. have only a key and an empty body if the user is still selecting)
 */
export default function Filters({ amcat, index, value, onChange }) {
  const fields = useFields(amcat, index);
  if (!fields || !value) return null;
  const selectedfields = Object.keys(value);
  const fieldlist = fields.filter((f) => f.name in value);

  const handleSelection = (selection) => {
    const result = { ...value };
    selection.filter((f) => !(f in result)).forEach((to_add) => (result[to_add] = {}));
    Object.keys(result)
      .filter((f) => selection.indexOf(f) === -1)
      .forEach((to_del) => delete result[to_del]);
    onChange(result);
  };

  const handleChange = (field, newval) => {
    const unchanged = JSON.stringify(newval) === JSON.stringify(value[field]);
    if (unchanged) return;

    const result = { ...value };
    result[field] = newval;
    onChange(result);
  };

  const createFilterField = (field) => {
    const val = value[field.name];
    const handler = (value) => handleChange(field.name, value);
    switch (field.type) {
      case "date":
        return <DateField key={field.name} field={field.name} value={val} onChange={handler} />;
      case "keyword":
      case "tag":
        return (
          <KeywordField
            key={field.name}
            amcat={amcat}
            index={index}
            field={field.name}
            value={val}
            onChange={handler}
          />
        );
      default:
        console.log("Unknown field type: %s", field);
    }
  };

  return (
    <Button.Group vertical style={{ width: "100%" }}>
      <FieldSelector fields={fields} value={selectedfields} onChange={handleSelection} />
      {fieldlist.map(createFilterField)}
    </Button.Group>
  );
}

/**
 *
 * Select a subset of fields
 * Props:
 * - fields: an array of fields [{name, type}, ...]
 * - value: an array of selected field names
 * - onChange: will be called with a new array of selected field names
 */
const FieldSelector = ({ fields, value, onChange }) => {
  const options = fields
    .filter((field) => ["tag", "keyword", "date"].includes(field.type))
    .map((f) => ({
      key: f.name,
      value: f.name,
      text: f.name,
      icon: f.type === "date" ? "calendar alternate outline" : "list",
    }));

  const content = value.join(", ") || "Select filters";

  return (
    <FilterButton
      content={content}
      icon="filter"
      onlyContent
      disabled={options.length === 0}
      style={{ background: "blue", color: "white" }}
    >
      <Dropdown
        open
        clearable
        fluid
        multiple
        selection
        search
        header="Select fields to filter on"
        options={options}
        value={value}
        style={{ width: "300px" }}
        noResultsMessage=""
        onChange={(_e, d) => onChange(d.value)}
      />
    </FilterButton>
  );
};
