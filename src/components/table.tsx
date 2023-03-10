import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";

export interface CommonTableColumn<TRowData> {
  accessor?: keyof TRowData;
  label?: string;
  render?: (data: TRowData) => JSX.Element | string;
}

export interface CommonTableProps<TData> {
  data: TData[];
  columns: CommonTableColumn<TData>[];
  total: number;
  onPageChange?: () => void;
  onRowsPerPageChange?: () => void;
  page: number;
  rowsPerPage: number;
}

const CommonTable = <TData extends {[key: string]: any}>(props: CommonTableProps<TData>) => {
  const {
    data = [],
    columns = [],
    total = 0,
    onPageChange = () => {},
    onRowsPerPageChange = () => {},
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.label}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((rowData, index) => {
                return (
                  <TableRow hover key={index}>
                    {columns.map(({ label, accessor, render }) => (
                      <TableCell key={label}>
                        {render ? render(rowData) : rowData?.[accessor ?? ""]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default CommonTable;
