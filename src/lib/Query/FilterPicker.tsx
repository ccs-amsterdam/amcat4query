import { Button, Icon, Popup } from "semantic-ui-react";
import { AmcatField, AmcatFilter, AmcatIndex } from "..";
import { filterLabel, FilterPopup } from "./FilterPopups";

interface FilterPickerProps {
  index: AmcatIndex;
  field: AmcatField;
  value: AmcatFilter;
  onChange?: (value: AmcatFilter) => void;
  onDelete?: () => void;
  [key: string]: any;
}
export default function FilterPicker({
  onDelete,
  index,
  field,
  value,
  onChange,
  ...props
}: FilterPickerProps) {
  return (
    <Popup
      on="click"
      position="bottom center"
      trigger={
        <Button {...props} className="valuepicker">
          {onDelete == null ? null : <Icon link name="delete" onClick={onDelete} />}
          {filterLabel(field, value, true)}
        </Button>
      }
    >
      <FilterPopup index={index} field={field} value={value} onChange={onChange} />
    </Popup>
  );
}
