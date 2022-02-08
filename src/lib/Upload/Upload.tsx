import { useRef, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";
import { useCSVReader } from "react-papaparse";
import ImportTable from "./ImportTable";
import SubmitButton from "./SubmitButton";
import "./uploadStyle.css";
import { IndexProps } from "../interfaces";
import useFields from "../components/useFields";
import { getField } from "../apis/Amcat";

const styles = {
  csvReader: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  browseFile: {
    width: "20%",
  },
  acceptedFile: {
    border: "1px solid #ccc",
    height: 45,
    lineHeight: 2.5,
    paddingLeft: 10,
    width: "80%",
  },
  remove: {
    borderRadius: 0,
    padding: "0 20px",
  },
  progressBarBackgroundColor: {
    backgroundColor: "red",
  },
};

export default function Upload({ amcat, index }: IndexProps) {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState<string[][]>([]);
  const [columns, setColumns] = useState(null);
  const fields = useFields(amcat, index);
  const fileRef = useRef();

  useEffect(() => {
    console.log({ fields, data });
    if (!fields) return;
    if (data.length <= 1) return;
    const columns = data[0].map((name: string) => {
      const field = getField(fields, name);
      return { name, field: name, type: field?.type || "auto" };
    });
    setColumns(columns);
  }, [fields, data]);

  const reset = () => {
    console.log(fileRef.current);
    if (fileRef.current) (fileRef.current as any).click();
    setData([]);
  };

  return (
    <Container>
      <CSVReader
        onUploadAccepted={(res: any) => {
          setData(res.data);
        }}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: InnerProps) => (
          <>
            <div style={styles.csvReader as React.CSSProperties}>
              <button type="button" {...getRootProps()} style={styles.browseFile}>
                Browse file
              </button>
              <div style={styles.acceptedFile}>{acceptedFile && acceptedFile.name}</div>
              <button ref={fileRef} {...getRemoveFileProps()} style={styles.remove}>
                Remove
              </button>
            </div>
            <ProgressBar style={styles.progressBarBackgroundColor} />
          </>
        )}
      </CSVReader>
      <br />
      <ImportTable data={data} columns={columns} setColumns={setColumns} fields={fields} />
      <SubmitButton
        amcat={amcat}
        index={index}
        data={data}
        columns={columns}
        fields={fields}
        reset={reset}
      />
    </Container>
  );
}
interface InnerProps {
  getRootProps: () => any;
  acceptedFile: { name: string };
  ProgressBar: any;
  getRemoveFileProps: () => any;
}
