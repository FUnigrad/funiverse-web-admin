import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Syllabus } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function SyllabusPage() {
  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation({
    mutationFn: (id: number) => syllabusApis.deleteSyllabus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Syllabuses] });
      dispatch({ type: 'close' });
    },
  });
  const navigate = useNavigate();
  const columns = useMemo<MRT_ColumnDef<Syllabus>[]>(
    () => [
      {
        header: 'Subject Code',
        accessorKey: 'subject.code',
      },
      {
        header: 'Subject Name',
        accessorKey: 'subject.name',
      },
      {
        header: 'Syllabus Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
      },
      {
        header: 'No credit',
        accessorKey: 'noCredit',
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
    navigate('create');
  }
  function onEditEntity(row: MRT_Row<Syllabus>) {
    navigate(`${row.id}/edit`);
  }
  const queryClient = useQueryClient();

  function onDeleteEntity(row: MRT_Row<Syllabus>) {
    console.log('🚀 ~ row:', row);
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.original.id);
      },
      payload: {
        title: 'Delete this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to delete {row.original.name}?
          </Typography>
        ),
      },
    });
  }
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Syllabuses],
    queryFn: syllabusApis.getSyllabuses,
    refetchOnWindowFocus: false,
  });
  return (
    <Box>
      <ListPageHeader entity="syllabus" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Syllabus>) => originalRow.id}
      />
    </Box>
  );
}

export default SyllabusPage;
