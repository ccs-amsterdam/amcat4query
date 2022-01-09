import React, { useRef, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { CSVReader } from "react-papaparse";
import ImportTable from "./ImportTable";
import SubmitButton from "./SubmitButton";
import "./amcatUploadStyle.css";

export default function AmcatUpload({ amcat, index }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(null);
  const [fields, setFields] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    if (!data) return;
    amcat
      .getFields(index)
      .then((res) => {
        setFields(res.data);
      })
      .catch((e) => {
        setFields(null);
        console.log(e);
      });
  }, [amcat, index, data, setFields]);

  useEffect(() => {
    if (data.length <= 1) return;
    const columns = data[0].data.map((name) => {
      return { name, field: name, type: fields[name] || "auto" };
    });
    setColumns(columns);
  }, [fields, data, setColumns, setFields]);

  return (
    <Container>
      <CSVReader
        ref={fileRef}
        onFileLoad={(data) => setData(data)}
        addRemoveButton
        onRemoveFile={() => setData([])}
      >
        <span>Click to upload</span>
      </CSVReader>
      <br />
      <ImportTable data={data} columns={columns} setColumns={setColumns} fields={fields} />
      <SubmitButton
        amcat={amcat}
        index={index}
        data={data}
        columns={columns}
        fields={fields}
        fileRef={fileRef}
      />
    </Container>
  );
}
