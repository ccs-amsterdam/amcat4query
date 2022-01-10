import React, { useState } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

export default function FilterButton({ field, content, icon, style, children }) {
  const [open, setOpen] = useState(false);

  const onClick = (e, d) => {
    e.preventDefault(); // for some obscure reason, everything goes to shit if this button is pressed
    setOpen(!open);
  };

  return (
    <Popup
      open={open}
      onClose={() => setOpen(false)}
      mouseLeaveDelay={99999}
      trigger={
        <Button fluid onClick={onClick} style={{ ...style, padding: "10px 20px" }}>
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
