import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { MRT_Row, MRT_ColumnDef } from 'material-react-table';
import { useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { User } from 'src/@types';
import { QueryKey, curriculumApis, searchApis, userApis, groupApis } from 'src/apis';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { toast } from 'react-toastify';
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add';
function GroupUsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { slug } = useParams();

  const { dispatch } = useContext(ModalContext);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Groups, 'slug', 'users'],
    queryFn: () => groupApis.getGroupUsers(slug),
    retry: 0,
    enabled: Boolean(slug),
  });
  // const mutation = useMutation({
  //   mutationFn: (id) => curriculumApis.deleteCurriculum(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QueryKey.Curriculums] });
  //     toast.success(`Deactivate User successfully!`);
  //     dispatch({ type: 'close' });
  //   },
  // });
  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        enableHiding: false,
      },
      {
        header: 'E-mail',
        accessorKey: 'eduMail',
      },
      // {
      //   header: 'Role',
      //   accessorKey: 'role',
      // },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
      },
      {
        header: 'Active',
        accessorKey: 'active',
        enableSorting: false,
        Cell: ({ cell }) => (
          <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
        ),
      },
    ],
    [],
  );
  function onCreateEntity() {
    // dispatch({
    //   type: 'open',
    //   payload: {
    //     title: 'Create User',
    //     content: () => <CurriculumFormPage />,
    //   },
    //   onCreateOrSave: () => {},
    // });
    // navigate('create');
  }

  // function onEditEntity(row: MRT_Row<User>) {
  //   if (!row) return;
  //   navigate(`${row.id}/edit`);
  // }

  function onDeleteEntity(row: MRT_Row<User>) {
    if (!row) return;

    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        // mutation.mutate(row.id as any);
      },
      payload: {
        // title: 'Delete this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to deactivate {row.original.name}?
          </Typography>
        ),
      },
    });
  }
  function onAddUserToEntity() {}
  return (
    <Box>
      {/* <ListPageHeader entity="curriculum" onCreateEntity={onCreateEntity} /> */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Users in group
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddUserToEntity}>
          Add Users
        </Button>
      </Box>
      <Table
        columns={columns}
        data={data}
        // onAddUserToEntity={onAddUserToEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<User>) => originalRow.id}
      />
    </Box>
  );
}

export default GroupUsersPage;
