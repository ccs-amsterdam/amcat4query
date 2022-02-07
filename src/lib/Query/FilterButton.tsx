import { CSSProperties, SyntheticEvent, useState } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

interface FilterButtonProps {
  field: string;
  content: any;
  children: any;
  icon: SemanticICONS;
  disabled?: boolean;
  onlyContent?: boolean;
  style?: CSSProperties;
}

export default function FilterButton({
  field,
  content,
  icon,
  style,
  disabled,
  onlyContent,
  children,
}: FilterButtonProps) {
  const [open, setOpen] = useState(false);

  const onClick = (e: SyntheticEvent) => {
    e.preventDefault(); // for some obscure reason, everything goes to shit if this button is pressed
    setOpen(!open);
  };

  const popupStyle: any = {};
  if (onlyContent) {
    popupStyle.margin = "0";
    popupStyle.padding = "0";
  }

  return (
    <Popup
      open={open}
      onClose={() => setOpen(false)}
      mouseLeaveDelay={99999}
      style={popupStyle}
      trigger={
        <Button
          fluid
          disabled={disabled}
          onClick={onClick}
          style={{ ...style, textAlign: "center", padding: "10px 20px" }}
        >
          {field ? (
            <span
              style={{
                display: "inline-block",
                float: "left",
                color: "black",
                borderRadius: "0px",
                padding: "0px",
                margin: "0px 10px 0px -10px",
              }}
            >
              {field}
            </span>
          ) : null}
          {icon ? <Icon name={icon} /> : null}
          {content}
        </Button>
      }
    >
      {children}
    </Popup>
  );
}
