import { Container, Pagination, Table, Icon } from "semantic-ui-react";
import { SemanticWIDTHS } from "semantic-ui-react/dist/commonjs/generic";
import { removeElasticTags, highlightElasticTags } from "../functions/highlightElasticTags";
import "./paginationTableStyle.css";

export interface PaginationTableColumn {
  /** Object should have key 'name', which by default is both the column name in the table, and the value fetched from data. */
  name: string;
  /** Set to true to hide this column */
  hide?: boolean;
  /** Optional transformation function to run over the *row*  */
  f?: (row: TableRow) => TableRow;
  /** Optional 'width' to specify width in SemanticUIs 16 parts system. */
  width?: SemanticWIDTHS;
}

interface TableRow {
  [key: string]: any;
}

export interface PaginationFooterProps {
  /** the number of pages */
  pages: number;
  /** the function to perform on pagechange. Gets pageindex as an argument, and should update data */
  pageChange: (page: number) => void;
}

export interface PaginationProps extends PaginationFooterProps {
  /** an Array with data for a single page */
  data: TableRow[];
  /** an Array with objects indicating which columns to show and how. */
  columns: PaginationTableColumn[];
  /** the number of pages */
  onClick: (value: any) => void;
}

export function PaginationFooter({ pages, pageChange }: PaginationFooterProps) {
  if (pages <= 1) return null;
  return (
    <Pagination
      fluid
      size="mini"
      boundaryRange={1}
      siblingRange={1}
      ellipsisItem={{
        content: <Icon name="ellipsis horizontal" />,
        icon: true,
      }}
      firstItem={{
        content: <Icon name="angle double left" />,
        icon: true,
      }}
      lastItem={{
        content: <Icon name="angle double right" />,
        icon: true,
      }}
      prevItem={{ content: <Icon name="angle left" />, icon: true }}
      nextItem={{
        content: <Icon name="angle right" />,
        icon: true,
      }}
      pointing
      secondary
      defaultActivePage={1}
      totalPages={pages}
      onPageChange={(e, d) => pageChange((d.activePage as number) - 1)}
    ></Pagination>
  );
}

/**
 * A nice table with pagination
 */
export default function PaginationTable({
  data,
  columns,
  pages,
  pageChange,
  onClick,
}: PaginationProps) {
  const createHeaderRow = (columns: PaginationTableColumn[]) => {
    return columns.map((col, i) => {
      if (col.hide) return null;

      return (
        <Table.HeaderCell key={i} width={col.width || null}>
          <span title={col.name}>{col.name}</span>
        </Table.HeaderCell>
      );
    });
  };

  const createBodyRows = (data: TableRow[], columns: PaginationTableColumn[]) => {
    return data.map((rowObj, i) => {
      return (
        <Table.Row key={i} style={{ cursor: "pointer" }} onClick={() => onClick(rowObj)}>
          {createRowCells(rowObj, columns)}
        </Table.Row>
      );
    });
  };

  const createRowCells = (rowObj: TableRow, columns: PaginationTableColumn[]) => {
    return columns.map((column, i) => {
      if (column.hide) return null;
      let content;
      if (column.f) {
        content = column.f(rowObj);
      } else {
        content = rowObj ? rowObj[column.name] : null;
      }

      return (
        <Table.Cell
          key={i}
          style={{
            minWidth: column.width || "50px",
            maxWidth: column.width || "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span title={removeElasticTags(content)}>{highlightElasticTags(content)}</span>
        </Table.Cell>
      );
    });
  };

  if (data.length < 1) return null;
  const columnSelection = columns || Object.keys(data[0]).map((name) => ({ name }));

  return (
    <Container style={{ width: "100%", overflow: "auto" }}>
      <Table unstackable selectable compact singleLine size="small" style={{ fontSize: "10px" }}>
        <Table.Header>
          <Table.Row>{createHeaderRow(columnSelection)}</Table.Row>
        </Table.Header>
        <Table.Body>{createBodyRows(data, columnSelection)}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={columnSelection.length}>
              <PaginationFooter pages={pages} pageChange={pageChange} />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  );
}
