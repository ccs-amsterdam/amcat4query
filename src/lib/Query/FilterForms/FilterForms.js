import React, { useEffect, useState } from "react";
import KeywordField from "./KeywordField";
import DateField from "./DateField";

export default function FilterForms({ amcat, index, filters, query, setQuery }) {
  const [fieldValues, setFieldValues] = useState({});
  const [forms, setForms] = useState([]);

  useEffect(() => {
    if (!amcat || !index || !filters) {
      setForms([]);
      return;
    }
    getFieldValues(amcat, index, filters, fieldValues, setFieldValues);
  }, [amcat, index, filters, fieldValues, setFieldValues]);

  useEffect(() => {
    if (!fieldValues || Object.keys(fieldValues).length === 0) {
      setForms([]);
    } else {
      const currentFieldValues = filters.reduce((cfv, f) => {
        if (fieldValues[f]) cfv[f] = fieldValues[f];
        return cfv;
      }, {});
      setForms(renderForms(currentFieldValues, query, setQuery));
    }
  }, [filters, fieldValues, query, setQuery]);

  return forms;
}

const renderForms = (fieldValues, query, setQuery) => {
  return Object.keys(fieldValues).map((field) => {
    const fv = fieldValues[field];
    return renderForm(field, fv.type, fv.data, query, setQuery);
  });
};

const renderForm = (field, type, data, query, setQuery) => {
  switch (type) {
    case "date":
      return <DateField field={"date"} query={query} setQuery={setQuery} />;
    case "keyword":
      return (
        <KeywordField
          field={field}
          options={data.map((d) => ({ value: d, text: d }))}
          query={query}
          setQuery={setQuery}
        />
      );
    default:
      return null;
  }
};

const getFieldValues = async (amcat, index, filters, fieldValues, setFieldValues) => {
  let hasUpdated = false;

  try {
    const res = await amcat.getFields(index);
    const fields = res.data;
    for (let filter of filters) {
      if (fieldValues[filter]) continue;
      const res = await amcat.getFieldValues(index, filter);
      fieldValues[filter] = { type: fields[filter], data: res.data };
      hasUpdated = true;
    }
  } catch (e) {
    console.log(e);
  }

  if (hasUpdated) setFieldValues({ ...fieldValues });
};
