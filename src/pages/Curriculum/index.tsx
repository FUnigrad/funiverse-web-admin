import React from 'react';
import StatusComingSoon from 'src/content/pages/Status/ComingSoon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Link as MuiLink, Checkbox } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Curriculum, GroupType } from 'src/@types';
import { QueryKey, groupApis, curriculumApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import CurriculumFormPage from './CurriculumForm';
function CurriculumPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Syllabuses],
    queryFn: curriculumApis.getCurriculums,
  });
  const mutation = useMutation({
    mutationFn: (id) => curriculumApis.deleteCurriculum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Curriculums] });
      dispatch({ type: 'close' });
    },
  });
  const columns = useMemo<MRT_ColumnDef<Curriculum>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
      },
      {
        header: 'Description',
        accessorKey: 'description',
      },
      {
        header: 'School Year',
        accessorKey: 'schoolYear',
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
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Curriculum',
        content: () => <CurriculumFormPage />,
      },
      onCreateOrSave: () => {},
    });
    // navigate('create');
  }

  // function onEditEntity(row: MRT_Row<Curriculum>) {
  //   if (!row) return;
  //   navigate(`${row.id}/edit`);
  // }

  function onDeleteEntity(row: MRT_Row<Curriculum>) {
    if (!row) return;

    dispatch({
      type: 'open_confirm',
      onConfirm: () => {
        mutation.mutate(row.id as any);
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
  return (
    <Box>
      <ListPageHeader entity="curriculum" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        // onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Curriculum>) => originalRow.id}
      />
    </Box>
  );
}

export default CurriculumPage;
