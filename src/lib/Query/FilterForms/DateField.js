import React from "react";

import { Form } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import FilterButton from "./FilterButton";

/**
 * Field for creating a date filter
 *
 * Props:
 * - field: the field name of the current field
 * - value: the current value of the filter, e.g. {"gte": "2020-01-01"}
 * - onChange: callback that will be called with a new filter value
 */
export default function DateField({ field, value, onChange }) {
  const handleChange = (key, newval) => {
    const result = { ...value };
    if (newval) result[key] = extractDateFormat(newval);
    else delete result[key];
    onChange(result);
  };

  const buttontext =
    !value.gte && !value.lte
      ? "DATE FILTER"
      : `${value.gte || "from start"}  -  ${value.lte || "till end"}`;
  return (
    <FilterButton field={field} content={buttontext} icon="calendar alternate outline">
      <Form.Field>
        <DatePicker
          label={"from date"}
          value={value.gte}
          onChange={(value) => handleChange("gte", value)}
        />
      </Form.Field>
      <Form.Field>
        <DatePicker
          label={"to date"}
          value={value.lte}
          onChange={(value) => handleChange("lte", value)}
        />
      </Form.Field>
    </FilterButton>
  );
}

const DatePicker = ({ label, value, onChange }) => {
  return (
    <SemanticDatepicker
      label={<b>{label}</b>}
      type="basic"
      value={value ? new Date(value) : ""}
      format="YYYY-MM-DD"
      onChange={(e, d) => {
        onChange(d.value);
      }}
      style={{ height: "1em", padding: "0" }}
    />
  );
};

const extractDateFormat = (date, ifNone = "") => {
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + "-" + month + "-" + day;
};
