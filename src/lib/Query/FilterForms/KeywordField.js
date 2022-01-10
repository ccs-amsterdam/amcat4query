import React from "react";
import { Dropdown } from "semantic-ui-react";
import FilterButton from "./FilterButton";

export default function KeywordField({ field, options, query, setQuery }) {
  const keywords = query?.filters?.[field] || [];

  const onChange = (value) => {
    if (value.length === 0) {
      if (query?.filters?.[field]) delete query.filters[field];
    } else {
      if (!query?.filters) query.filters = {};
      query.filters[field] = value;
    }
    setQuery({ ...query });
  };

  const content = keywords.join(", ") || "KEYWORD FILTER";

  return (
    <FilterButton field={field} content={content} icon="list">
      <Dropdown
        clearable
        value={keywords}
        fluid
        multiple
        selection
        search
        options={options}
        style={{ minWidth: "300px" }}
        onChange={(e, d) => onChange(d.value)}
      />
    </FilterButton>
  );
}
