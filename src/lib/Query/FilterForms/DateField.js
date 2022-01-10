import React from "react";

import { Form } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import FilterButton from "./FilterButton";

export default function DateField({ field, query, setQuery }) {
  const gte = query?.filters?.[field]?.gte || "";
  const lte = query?.filters?.[field]?.lte || "";

  const onChange = (value, which) => {
    if (!value) {
      if (query?.filters?.[field]?.[which] != null) delete query?.filters[field][which];
      if (query?.filters?.[field] && Object.keys(query.filters[field]).length === 0)
        delete query.filters[field];
    } else {
      if (!query?.filters) query.filters = {};
      if (!query.filters?.[field]) query.filters[field] = {};
      query.filters[field][which] = extractDateFormat(value);
    }
    setQuery({ ...query });
  };

  const buttontext =
    !gte && !lte ? "DATE FILTER" : `${gte || "from start"}  -  ${lte || "till end"}`;

  return (
    <FilterButton field={field} content={buttontext} icon="calendar alternate outline">
      <Form.Field>
        <DatePicker label={"from date"} value={gte} onChange={(value) => onChange(value, "gte")} />
      </Form.Field>
      <Form.Field>
        <DatePicker label={"to date"} value={lte} onChange={(value) => onChange(value, "lte")} />
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
