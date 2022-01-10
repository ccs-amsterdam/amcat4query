import React, { useEffect, useState } from "react";
import { Button, Dropdown } from "semantic-ui-react";
import FilterForms from "./FilterForms/FilterForms";
import FilterButton from "./FilterForms/FilterButton";

export default function Filters({ amcat, index, query, setQuery }) {
  const [fields, setFields] = useState({});
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    if (index && amcat) {
      amcat
        .getFields(index)
        .then((res) => {
          setFields(res.data);
        })
        .catch((e) => {
          setFields({});
        });
    } else {
      setFields({});
    }
  }, [amcat, index]);

  useEffect(() => {
    // make sure only selected filters are used in the query
    setQuery((query) => {
      if (!query?.filters) return query;
      for (let key of Object.keys(query.filters)) {
        if (!filters.includes(key)) delete query.filters[key];
      }
      return { ...query };
    });
  }, [filters, setQuery]);

  return (
    <Button.Group vertical style={{ width: "100%" }}>
      <SelectFields fields={fields} filters={filters} setFilters={setFilters} />
      <FilterForms
        amcat={amcat}
        index={index}
        filters={filters}
        query={query}
        setQuery={setQuery}
      />
    </Button.Group>
  );
}

const SelectFields = ({ fields, filters, setFilters }) => {
  const options = Object.keys(fields).reduce((options, name) => {
    if (fields[name] === "text") return options;
    if (name === "url") return options;
    options.push({ key: name, value: name, text: name });
    return options;
  }, []);

  const content = filters.join(", ") || "Select filters";

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
        value={filters}
        fluid
        multiple
        selection
        search
        options={options}
        style={{ width: "300px" }}
        noResultsMessage=""
        onChange={(e, d) => setFilters(d.value)}
      />
    </FilterButton>
  );
};
