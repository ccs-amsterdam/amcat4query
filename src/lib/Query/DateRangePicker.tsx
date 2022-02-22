import { Button, Form, Popup } from "semantic-ui-react";
import { AmcatFilter } from "..";
import { DateFilter } from "../interfaces";
import DatePicker from "./DatePicker";
import { FilterElementProps } from "./Filter";

function date2str(date: Date, ifNone = ""): string {
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + "-" + month + "-" + day;
}

export default function DateRangePicker({ value, onChange }: FilterElementProps) {
  const handleChange = (key: keyof DateFilter, newval: Date) => {
    let result = { ...value };
    if (newval == null) delete result[key];
    else result[key] = date2str(newval);
    onChange(result);
  };
  const filter2str = (filter: AmcatFilter) => {
    if (filter.gte && filter.lte) return `${filter.gte} - ${filter.lte}`;
    if (filter.gte) return `from ${filter.gte}`;
    if (filter.lte) return `until ${filter.lte}`;
    return "Select date range";
  };

  return (
    <Popup
      on="click"
      trigger={
        <Button attached className="valuepicker">
          {filter2str(value)}
        </Button>
      }
    >
      <Form.Field>
        <DatePicker
          label={"from date"}
          value={value.gte}
          onChange={(newval: Date) => handleChange("gte", newval)}
        />
      </Form.Field>
      <Form.Field>
        <DatePicker
          label={"to date"}
          value={value.lte}
          onChange={(newval: Date) => handleChange("lte", newval)}
        />
      </Form.Field>{" "}
    </Popup>
  );
}
