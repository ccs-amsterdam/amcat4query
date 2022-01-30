import { useState, useEffect } from "react";

export default function useFields(amcat, index) {
  const [fields, setFields] = useState({});

  useEffect(() => {
    if (index && amcat) {
      amcat
        .getFields(index)
        .then((res) => {
          setFields(res.data);
        })
        .catch((e) => {
          setFields({});
        });
    } else {
      setFields({});
    }
  }, [amcat, index]);

  return Object.values(fields);
}
