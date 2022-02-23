import { useState } from "react";
import { AmcatIndex, AmcatQuery } from "..";
import MultilineQueryForm from "./MultilineQueryForm";
import "./QueryForm.css";
import SimpleQueryForm from "./SimpleQueryForm";

export interface QueryFormProps {
  index: AmcatIndex;
  value: AmcatQuery;
  onSubmit: (value: AmcatQuery) => void;
}

export default function QueryForm({ index, value, onSubmit }) {
  const [simple, setSimple] = useState(true);
  if (!index) return null;
  const QForm = simple ? SimpleQueryForm : MultilineQueryForm;
  const handleClick = () => {
    setSimple(!simple);
  };
  // Thanks to https://icons.getbootstrap.com/icons/chevron-compact-down/
  const chevron = simple
    ? "M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67z"
    : "M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z";

  return (
    <div style={{ paddingBottom: "3em" }}>
      <QForm index={index} value={value} onSubmit={onSubmit} />

      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 1 }} />
        <svg
          className="chevron"
          preserveAspectRatio="none"
          onClick={handleClick}
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="24"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path fillRule="evenodd" d={chevron} />
        </svg>
        <div style={{ flexGrow: 1 }} />
      </div>
    </div>
  );
}
