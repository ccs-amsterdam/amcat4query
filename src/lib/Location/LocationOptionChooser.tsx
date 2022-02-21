import { Form, Message } from "semantic-ui-react";
import { AmcatIndex } from "..";
import useFields from "../Amcat";
import { LocationOptions } from "../interfaces";

interface LocationOptionChooserProps {
  index: AmcatIndex;
  value: LocationOptions;
  onChange: (value: LocationOptions) => void;
}

/** Form to select location options */
export default function LocationOptionChooser({
  index,
  value,
  onChange,
}: LocationOptionChooserProps) {
  const fields = useFields(index);
  if (index == null || fields == null) return null;
  const geo_fields = fields.filter((f) => f.type === "geo_point");
  if (geo_fields.length === 0)
    return <Message warning header="No geo_point columns found in index" />;
  const options = geo_fields.map((f, i) => ({
    key: i,
    text: f.name,
    value: f.name,
    icon: "map marker alternate",
  }));
  return (
    <>
      <Form>
        <Form.Dropdown
          placeholder="Select result display option"
          clearable
          fluid
          selection
          options={options}
          label="Location field"
          value={value?.field}
          onChange={(_e, option) => onChange({ ...value, field: option.value as string })}
        />
        <Form.Input
          placeholder="Maximum number of documents to use (default: 100)"
          fluid
          label="Maximum number of documents to use"
          value={value?.numdocs || ""}
          onChange={(_e, option) =>
            onChange({
              ...value,
              numdocs:
                option.value == null || option.value === "" ? undefined : parseInt(option.value),
            })
          }
        />
      </Form>
    </>
  );
}
