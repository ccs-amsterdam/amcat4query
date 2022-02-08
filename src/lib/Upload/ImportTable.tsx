import { Header, Table, Dropdown } from "semantic-ui-react";
import { getField } from "../apis/Amcat";
import { AmcatField } from "../interfaces";

//TODO: specify some of the any fields

const ES_MAPPINGS: { [key: string]: { type: string } } = {
  int: { type: "int" },
  date: { type: "date" },
  num: { type: "double" },
  keyword: { type: "keyword" },
  text: { type: "text" },
  object: { type: "object" },
  url: { type: "url" },
};
const REQUIRED_FIELDS = ["title", "date", "text"];

interface CSVField {
  name: string;
  field: string;
  type: string;
}

interface ImportTableProps {
  /** The AmCAT fields as used in the current index */
  fields: AmcatField[];
  /** The 'raw' csv data as uploaded */
  data: string[][];
  /** The current column mappings */
  columns: CSVField[];
  /** The callback for the final column mappings */
  setColumns: (columns: CSVField[]) => void;
}

/**
 * CSV Upload preview and column selection table
 */
export default function ImportTable({ fields, data, columns, setColumns }: ImportTableProps) {
  const n = 6;
  const headerCellStyle = {
    width: "10em",
    paddingTop: "2px",
    paddingBottom: "0",
    textAlign: "center",
    background: "lightgrey",
    overflow: "visible",
  };

  const headerName = () => {
    return columns.map((column, i) => (
      <Table.HeaderCell key={i} style={{ ...headerCellStyle, background: "grey", color: "white" }}>
        <span title={column.name}>{column.name}</span>
      </Table.HeaderCell>
    ));
  };

  const headerField = () => {
    const fieldOptions = fields.map((field) => {
      let description = "???"; //getField(fields, field) ? "exists" : null;
      let text = field.name;
      if (REQUIRED_FIELDS.includes(field.name)) {
        description = "required";
        text = text + "*";
      }
      return { key: field, value: field, text, description, color: "blue" };
    });

    const onChangeField = (i: number, newField: string) => {
      for (let column of columns) {
        if (column.field === newField) column.field = null;
      }
      columns[i].field = newField;
      const field = getField(fields, newField);
      if (field) columns[i].type = field.type;
      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const options: any[] = [...fieldOptions];
      const exists = getField(fields, column.field) != null;
      if (!exists) options.push({ key: column.field, value: column.field, text: column.field });
      console.log(options);
      return (
        <Table.HeaderCell key={i} style={headerCellStyle}>
          <Dropdown
            fluid
            search
            header="Select field or type to create new"
            value={column.field}
            style={{ height: "2em", textAlign: "center", color: exists ? "blue" : "black" }}
            placeholder="assign field"
            allowAdditions
            selection
            additionLabel="New Field "
            onAddItem={(e, d) => onChangeField(i, d.value as string)}
            onChange={(e, d) => onChangeField(i, d.value as string)}
            options={options}
          />
        </Table.HeaderCell>
      );
    });
  };

  const headerType = () => {
    let options: any[] = Object.keys(ES_MAPPINGS).map((em) => {
      return { key: em, value: em, text: em.toUpperCase(), description: ES_MAPPINGS[em] };
    });
    options = [{ key: "auto", value: "auto", text: "AUTO" }, ...options];

    const onChangeType = (i: number, newType: string) => {
      const fixedType = getField(fields, columns[i].field)?.type;
      if (fixedType) {
        columns[i].type = fixedType;
      } else {
        columns[i].type = newType;
      }
      console.log([...columns]);
      setColumns([...columns]);
    };

    return columns.map((column, i) => {
      const exists = getField(fields, column.field) != null;
      let color = exists ? "blue" : "black";
      if (!column.field) color = "grey";

      return (
        <Table.HeaderCell key={i} style={{ ...headerCellStyle, paddingBottom: "5px" }}>
          <Dropdown
            fluid
            search
            header="Select intended field type"
            style={{ height: "2em", textAlign: "center", color }}
            placeholder="type"
            value={column.type}
            disabled={exists != null}
            onChange={(e, d) => onChangeType(i, d.value as string)}
            options={options}
          />
        </Table.HeaderCell>
      );
    });
  };

  const headerRowLabel = (label: any) => {
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

  if (data.length <= 1) return null;
  if (!columns || columns.length !== data[0].length) return null;

  const createRows = (data: any[], n: number) => {
    const previewdata = data.slice(0, n + 1);
    return previewdata.slice(1).map((row, i) => {
      return <Table.Row key={i}>{createRowCells(row, i)}</Table.Row>;
    });
  };

  const createRowCells = (row: any[], i: number) => (
    <>
      <Table.Cell
        key="header"
        style={{ background: "grey", borderTop: "0", color: "white", textAlign: "right" }}
      >
        <b>{i === 2 ? "CSV content" : null}</b>
      </Table.Cell>
      {row.map((cell, j) => (
        <Table.Cell key={j} style={{ textAlign: "right" }}>
          <span title={cell}>{cell}</span>
        </Table.Cell>
      ))}
    </>
  );

  return (
    <div
      style={{
        marginTop: "3em",
        overflowX: "auto",
        minHeight: "350px",
        width: "100%",
      }}
    >
      <Table celled unstackable singleLine fixed size="small" compact>
        <Table.Header>
          <Table.Row key="col">
            {headerRowLabel("CSV column")}
            {headerName()}
          </Table.Row>

          <Table.Row key="field">
            {headerRowLabel("Index field")}
            {headerField()}
          </Table.Row>
          <Table.Row key="type">
            {headerRowLabel("field type")}
            {headerType()}
          </Table.Row>
        </Table.Header>
        <Table.Body>{createRows(data, n)}</Table.Body>
      </Table>
      {data.length > n ? <Header align="center">{data.length - 1 - n} more rows</Header> : null}
    </div>
  );
}
