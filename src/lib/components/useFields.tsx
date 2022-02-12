import { useState, useEffect } from "react";
import { getFields } from "../apis/Amcat";
import { AmcatField, AmcatIndex } from "../interfaces";

export default function useFields(index: AmcatIndex): AmcatField[] {
  const [fields, setFields] = useState<AmcatField[]>([]);

  useEffect(() => {
    if (index) {
      getFields(index)
        .then((res: any) => {
          setFields(Object.values(res.data));
        })
        .catch((_e: Error) => {
          setFields([]);
        });
    } else {
      setFields([]);
    }
  }, [index]);

  return Object.values(fields);
}
