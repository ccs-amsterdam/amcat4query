import { Dropdown, Grid } from "semantic-ui-react";
import { AmcatField, AmcatFilter, AmcatFilters, AmcatIndex } from "../interfaces";
import { useFields, getField, getFieldTypeIcon } from "../Amcat";
import FilterPicker from "./FilterPicker";
import "./Filter.scss";
export function filterOption(field: AmcatField) {
  return {
    key: field.name,
    text: field.name,
    value: field.name,
    icon: getFieldTypeIcon(field.type),
  };
}

interface FilterProps {
  index: AmcatIndex;
  /** the current filters, e.g. {"publisher": {"values": ["nrc"]}} */
  value: AmcatFilters;
  /**
   * Callback that will be called when the filter selection changes with a new filter object
   *   (note that the filter might be incomplete, i.e. have only a key and an empty body if the user is still selecting)
   */
  onChange: (value: AmcatFilters) => void;
}

export default function Filter({ index, value, onChange }: FilterProps) {
  const fields = useFields(index);
  if (!index || !fields) return null;
  const fieldOptions = fields
    .filter((f) => !Object.keys(value).includes(f.name))
    .filter((f) => ["date", "keyword"].includes(f.type))
    .map((f) => filterOption(f));

  const addFilter = (field: string) => {
    onChange({ ...value, [field]: {} });
  };
  const changeFilter = (old_field: string, new_field: string) => {
    let result = { ...value };
    delete result[old_field];
    if (new_field != null) result[new_field] = {};
    onChange(result);
  };
  const setFilter = (field: string, newval: AmcatFilter) => {
    onChange({ ...value, [field]: newval });
  };
  return (
    <>
      <Grid columns={3} padded className="a4filter">
        {value &&
          Object.keys(value).map((field) => (
            <FilterField
              index={index}
              key={field}
              field={getField(fields, field)}
              value={value[field]}
              fieldOptions={fieldOptions}
              onChangeField={changeFilter}
              onChangeFilter={setFilter}
            />
          ))}
        <AddFilterButton key={-1} fieldOptions={fieldOptions} onAdd={addFilter} />
      </Grid>
    </>
  );
}
interface AddFilterFieldProps {
  fieldOptions: any;
  onAdd?: (field: string) => void;
}

function AddFilterButton({ fieldOptions, onAdd }: AddFilterFieldProps) {
  return (
    <Grid.Row stretched>
      <Grid.Column width={16}>
        <Dropdown
          button
          className="icon fieldpicker newfield"
          icon="filter"
          labeled
          fluid
          floating
          text="Add filter"
          options={fieldOptions}
          value={""}
          onChange={(_, { value }) => onAdd(value as string)}
        />
      </Grid.Column>
    </Grid.Row>
  );
}

interface FilterFieldProps {
  index: AmcatIndex;
  field: AmcatField;
  value: AmcatFilter;
  fieldOptions: any;
  onChangeField?: (oldField: string, newField: string) => void;
  onChangeFilter?: (field: string, value: AmcatFilter) => void;
}
export function FilterField({
  index,
  field,
  value,
  fieldOptions,
  onChangeField,
  onChangeFilter,
}: FilterFieldProps) {
  // Add delete and selected value to options (latter is to allow intuitive cancel)
  const options = [
    { key: "-1", text: "Remove filter", value: undefined, icon: "delete" },
    filterOption(field),
    ...fieldOptions,
  ];
  return (
    <Grid.Row stretched>
      <Grid.Column width={6}>
        <Dropdown
          button
          className="icon left attached fieldpicker"
          icon={getFieldTypeIcon(field.type)}
          labeled
          fluid
          floating
          value={field.name}
          options={options}
          onChange={(_, { value }) => onChangeField(field.name, value as string)}
        />
      </Grid.Column>
      <Grid.Column width={10}>
        <FilterPicker
          index={index}
          field={field}
          value={value}
          attached
          onChange={(value: any) => onChangeFilter(field.name, value)}
        />
      </Grid.Column>
    </Grid.Row>
  );
}
