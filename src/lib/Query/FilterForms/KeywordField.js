import React, { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import FilterButton from "./FilterButton";

/**
 * Field for creating a text filter
 *
 * Props:
 * - amcat: an AmCAT instance (to retrieve possible values)
 * - index: the name of the current index
 * - field: the field name of the current field
 * - value: the current value of the filter, e.g. {"values": ["nrc"]}
 * - onChange: callback that will be called with a new filter value
 */
export default function KeywordField({ amcat, index, field, value, onChange }) {
  const [fieldValues, setFieldValues] = useState();
  useEffect(() => {
    getFieldValues(amcat, index, field, setFieldValues);
  }, [amcat, index, field, setFieldValues]);
  if (!fieldValues) return null;

  const handleChange = (values) => {
    onChange(values.length === 0 ? {} : { values: values });
  };

  const keywords = value?.values || [];
  const content = keywords.join(", ") || "KEYWORD FILTER";
  const options = fieldValues.map((v) => ({ key: v, value: v, text: v }));
  return (
    <FilterButton field={field} content={content} onlyContent icon="list">
      <Dropdown
        open
        clearable
        value={keywords}
        fluid
        multiple
        selection
        search
        options={options}
        header={`Select keywords for field "${field}""`}
        style={{ minWidth: "300px" }}
        onChange={(e, d) => handleChange(d.value)}
      />
    </FilterButton>
  );
}

async function getFieldValues(amcat, index, field, setValues) {
  const values = await amcat.getFieldValues(index, field);
  setValues(values.data);
}
