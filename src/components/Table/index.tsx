import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import MaterialReactTable, { MRT_Row } from 'material-react-table';
import { MaterialReactTableProps } from 'material-react-table';
interface TableProps {
  columns: MRT_ColumnDef<any>[];
  onEditEntity?: (row: MRT_Row<any>) => void;
  onDeleteEntity?: (row: MRT_Row<any>) => void;
  data: any[];
  state: MaterialReactTableProps['state'];
  getRowId: MaterialReactTableProps['getRowId'];
}
function Table({ columns, onEditEntity, onDeleteEntity, data, state, getRowId }: TableProps) {
  const tableProps: Partial<MaterialReactTableProps> = {};
  const applyRowActions = Boolean(onEditEntity) || Boolean(onDeleteEntity);
  if (applyRowActions)
    tableProps.renderRowActions = ({ row }) => (
      <Box>
        {Boolean(onEditEntity) && (
          <IconButton size="small" onClick={() => onEditEntity(row)}>
            <EditOutlined color="warning" />
          </IconButton>
        )}
        {Boolean(onDeleteEntity) && (
          <IconButton color="error" size="small" onClick={() => onDeleteEntity(row)}>
            <DeleteOutlined />
          </IconButton>
        )}
      </Box>
    );
  return (
    <MaterialReactTable
      getRowId={getRowId}
      columns={columns}
      data={data ?? []}
      state={state}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '10px',
          padding: 2,
          '& .MuiTableRow-root': {
            backgroundColor: '#fff',
          },
          '& .MuiToolbar-root': {
            backgroundColor: '#fff',
          },
          '& .MuiTableCell-root:last-child > .MuiBox-root': {
            display: 'flex',
            alignItems: 'center',
          },
        },
      }}
      {...tableProps}
      displayColumnDefOptions={{
        'mrt-row-actions': {
          size: 40,
        },
      }}
      positionActionsColumn="last"
      enableRowActions
      enableFullScreenToggle={false}
    />
  );
}

export default Table;