import { useState, useEffect } from "react";
import Amcat from "../apis/Amcat";
import { AmcatField } from "../interfaces";

export default function useFields(amcat: Amcat, index: string): AmcatField[] {
  const [fields, setFields] = useState<AmcatField[]>([]);

  useEffect(() => {
    if (index && amcat) {
      amcat
        .getFields(index)
        .then((res: any) => {
          setFields(Object.values(res.data));
        })
        .catch((_e: Error) => {
          setFields([]);
        });
    } else {
      setFields([]);
    }
  }, [amcat, index]);

  return fields;
}
