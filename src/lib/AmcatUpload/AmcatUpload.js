import React, { useRef, useEffect, useState } from "react";
import {
  Container,
  Header,
  Table,
  Button,
  Dropdown,
  Message,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import { CSVReader } from "react-papaparse";

const ES_MAPPINGS = {
  int: { type: "long" },
  date: { type: "date" },
  num: { type: "double" },
  keyword: { type: "keyword" },
  text: { type: "text" },
  object: { type: "object" },
};
const REQUIRED_FIELDS = ["title", "date", "text"];

export default function UploadTextsCsv({ amcat, index }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState(null);
  const [fields, setFields] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    amcat
      .getFields(index)
      .then((res) => {
        setFields(res.data);
      })
      .catch((e) => {
        setFields(null);
        console.log(e);
      });
  }, [amcat, index, setFields]);

  useEffect(() => {
    if (data.length <= 1) return;
    const columns = data[0].data.map((name) => {
      return { name, field: name, type: fields[name] || "GUESS" };
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
      <SubmitButton amcat={amcat} index={index} data={data} columns={columns} fileRef={fileRef} />
    </Container>
  );
}

const csvToJson = (data, columns) => {
  const fieldIndex = columns.reduce((obj, column, i) => {
    if (column.field) obj[column.field] = i;
    return obj;
  }, {});

  return data.slice(1).map((row) => {
    const datarow = Object.keys(fieldIndex).reduce((obj, field) => {
      obj[field] = row.data[fieldIndex[field]];
      return obj;
    }, {});
    return datarow;
  });
};

const SubmitButton = ({ amcat, index, data, columns }) => {
  const [loading, setLoading] = useState(false);

  const notReady = !index || !columns || data.length <= 1 || columns.length !== data[0].data.length;
  if (notReady) return null;

  let fields = new Set();
  //let hasDuplicates = false;
  for (let column of columns) {
    //if (field.has(column.field)) hasDuplicates = true
    fields.add(column.field);
  }

  const missingRequired = [];
  for (let required of REQUIRED_FIELDS) {
    if (!fields.has(required)) missingRequired.push(required);
  }

  const onSubmit = async () => {
    const preparedData = csvToJson(data, columns);

    setLoading(true);
    try {
      await amcat.createDocuments(index, preparedData);
      //fileRef.current.removeFile();
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const missingRequiredMessage = () => {
    if (missingRequired.length === 0) return null;
    return (
      <Message>
        Some required fields are not used: <b>{missingRequired.join(", ")}</b>
      </Message>
    );
  };

  return (
    <Container>
      <Dimmer>
        <Loader active={loading} />
      </Dimmer>
      {missingRequiredMessage()}
      <Button disabled={notReady || missingRequired.length > 0} fluid onClick={onSubmit}>
        Upload Articles
      </Button>
    </Container>
  );
};

const ImportTable = ({ data, columns, setColumns, fields }) => {
  const n = 5;

  const headerCellStyle = {
    width: "10em",
    paddingTop: "2px",
    paddingBottom: "0",
    textAlign: "center",
    background: "lightgrey",
    overflow: "visible",
  };

  const headerName = (data) => {
    return columns.map((column) => {
      return (
        <Table.HeaderCell style={{ ...headerCellStyle, background: "grey", color: "white" }}>
          <span title={column.name}>{column.name}</span>
        </Table.HeaderCell>
      );
    });
  };

  const headerField = (data) => {
    const fieldOptions = Object.keys(fields).map((field) => {
      let description = fields[field] ? "exists" : null;
      if (REQUIRED_FIELDS.includes(field)) description = "required";
      return { key: field, value: field, text: field, description };
    });

    const onChangeField = (i, newField) => {
      for (let column of columns) {
        if (column.field === newField) column.field = null;
      }
      columns[i].field = newField;
      if (fields[newField]) columns[i].type = fields[newField];
      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const options = [...fieldOptions];
      const exists = fields[column.field];
      if (!exists) options.push({ key: column.field, value: column.field, text: column.field });

      return (
        <Table.HeaderCell style={headerCellStyle}>
          <Dropdown
            fluid
            search
            header="Select or create (type) field name"
            value={column.field}
            style={{ height: "2em", textAlign: "center", color: exists ? "blue" : "black" }}
            placeholder="assign field"
            allowAdditions
            additionLabel="New Field "
            onAddItem={(e, d) => onChangeField(i, d.value)}
            onChange={(e, d) => onChangeField(i, d.value)}
            options={options}
          />
        </Table.HeaderCell>
      );
    });
  };

  const headerType = (data) => {
    const options = Object.keys(ES_MAPPINGS).map((em) => {
      return { key: em, value: em, text: em.toUpperCase(), description: ES_MAPPINGS[em] };
    });
    options.push({ key: "GUESS", value: "GUESS", text: "GUESS" });

    const onChangeType = (i, newType) => {
      const fixedType = fields[columns[i].field]?.type;
      if (fixedType) {
        columns[i].type = fixedType;
      } else {
        columns[i].type = newType;
      }
      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const exists = fields[column.field];
      let color = exists ? "blue" : "black";
      if (!column.field) color = "grey";

      return (
        <Table.HeaderCell style={{ ...headerCellStyle, paddingBottom: "5px" }}>
          <Dropdown
            fluid
            header="Select intended field type"
            style={{ height: "2em", textAlign: "center", color }}
            placeholder="type"
            value={column.type}
            disabled={exists}
            onChange={(e, d) => onChangeType(i, d.value)}
            options={options}
          />
        </Table.HeaderCell>
      );
    });
  };

  const headerRowLabel = (label) => {
    return (
      <Table.HeaderCell
        style={{
          ...headerCellStyle,
          textAlign: "right",
          background: "grey",
          color: "white",
          width: "6em",
        }}
      >
        {label}
      </Table.HeaderCell>
    );
  };

  const createRows = (data, n) => {
    const previewdata = data.slice(0, n + 1);
    return previewdata.slice(1).map((row) => {
      return <Table.Row>{createRowCells(row.data)}</Table.Row>;
    });
  };

  const createRowCells = (row) => {
    const rowCells = row.map((cell) => {
      return (
        <Table.Cell style={{ textAlign: "right" }}>
          <span title={cell}>{cell}</span>
        </Table.Cell>
      );
    });
    return [<Table.Cell style={{ background: "grey", borderTop: "0" }} />, ...rowCells];
  };

  if (data.length <= 1) return null;
  if (!columns || columns.length !== data[0].data.length) return null;

  return (
    <div
      style={{
        marginTop: "3em",
        overflowX: "auto",
        minHeight: "400px",
        width: "100%",
      }}
    >
      <Table celled unstackable singleLine fixed size="small" compact>
        <Table.Header>
          <Table.Row>
            {headerRowLabel("CSV column")}
            {headerName(data)}
          </Table.Row>

          <Table.Row>
            {headerRowLabel("Index field")}
            {headerField(data)}
          </Table.Row>
          <Table.Row>
            {headerRowLabel("field type")}
            {headerType(data)}
          </Table.Row>
        </Table.Header>
        <Table.Body>{createRows(data, n)}</Table.Body>
      </Table>
      {data.length > n ? <Header align="center">{data.length - 1 - n} more rows</Header> : null}
    </div>
  );
};
