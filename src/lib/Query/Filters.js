import React, { useEffect, useState } from "react";
import { Form, Container, Dropdown, Header } from "semantic-ui-react";
import FilterForms from "./FilterForms";

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

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Field width={4}>
            <Header>Filters</Header>
          </Form.Field>
          <Form.Field width={14}>
            <SelectFields fields={fields} filters={filters} setFilters={setFilters} />
          </Form.Field>
        </Form.Group>
        <FilterForms
          amcat={amcat}
          index={index}
          filters={filters}
          query={query}
          setQuery={setQuery}
        />
      </Form>
    </Container>
  );
}

const SelectFields = ({ fields, filters, setFilters }) => {
  const options = Object.keys(fields).reduce((options, name) => {
    if (fields[name] === "text") return options;
    if (name === "date" || name === "url") return options;
    options.push({ key: name, value: name, text: name });
    return options;
  }, []);
  return (
    <Dropdown
      clearable
      value={filters}
      fluid
      multiple
      selection
      search
      options={options}
      onChange={(e, d) => setFilters(d.value)}
    />
  );
};
