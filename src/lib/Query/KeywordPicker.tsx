import { useEffect, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { Amcat } from "..";
import { FilterElementProps } from "./Filter";

export default function KeywordPicker({ index, value, field, onChange }: FilterElementProps) {
  const [values, setValues] = useState<string[]>();
  useEffect(() => {
    Amcat.getFieldValues(index, field.name)
      .then((d) => setValues(d.data))
      .catch(() => {
        setValues(undefined);
      });
  }, [index, field, setValues]);
  const loading = values == null;
  const options = loading
    ? undefined
    : values.map((val, i) => ({ key: val, text: val, value: val }));
  console.log({ values, options });
  return (
    <Dropdown
      multiple={!loading}
      scrolling
      search={!loading}
      selection={!loading}
      placeholder="Select values"
      loading={!options}
      button
      className="attached valuepicker"
      value={value?.values || []}
      options={options || []}
      icon=""
      onChange={(_, { value }) => onChange({ values: value as string[] })}
    />
  );
}
