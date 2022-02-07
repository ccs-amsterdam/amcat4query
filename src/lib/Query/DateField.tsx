import { Form } from "semantic-ui-react";
import FilterButton from "./FilterButton";
import { DateFilter } from "../interfaces";
import DatePicker from "./DatePicker";

interface DateFieldProps {
  /** the field name of the current field */
  field: string;
  /** the current value of the filter, e.g. {"gte": "2020-01-01"} */
  value: DateFilter;
  /** callback that will be called with a new filter value */
  onChange: (value: DateFilter) => void;
}

/**
 * Field for creating a date filter
 */
export default function DateField({ field, value, onChange }: DateFieldProps) {
  const handleChange = (key: keyof DateFilter, newval: Date) => {
    const result: DateFilter = { ...value };
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
          onChange={(value: Date) => handleChange("gte", value)}
        />
      </Form.Field>
      <Form.Field>
        <DatePicker
          label={"to date"}
          value={value.lte}
          onChange={(value: Date) => handleChange("lte", value)}
        />
      </Form.Field>
    </FilterButton>
  );
}

const extractDateFormat = (date: Date, ifNone = ""): string => {
  if (!date) return ifNone;
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const year = date.getUTCFullYear();
  return year + "-" + month + "-" + day;
};
