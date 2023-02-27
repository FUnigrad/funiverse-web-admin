import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Major } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { majorApis } from 'src/apis';
import { generateOptions } from 'src/utils';
import MajorForm from './MajorForm';
function MajorPage() {
  const { dispatch } = useContext(ModalContext);

  const columns = useMemo<MRT_ColumnDef<Major>[]>(
    () => [
      {
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
    ],
    [],
  );
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Majors],
    queryFn: majorApis.getMajors,
    refetchOnWindowFocus: false,
  });
  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Major',
        // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        content: () => <MajorForm />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onEditEntity(row: MRT_Row<Major>) {
    const { original } = row;
    const defaultValues = {
      id: original.id,
      name: original.name,
      code: original.code,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Group',
        content: () => <MajorForm defaultValues={{ ...(defaultValues as any) }} />,
        // content: () => <SubjectForm defaultValues />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity(row: MRT_Row<Major>) {
    if (!row) return;
    dispatch({
      type: 'open_confirm',
      onConfirm: () => {},
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
  return (
    <Box>
      <ListPageHeader entity="major" onCreateEntity={onCreateEntity} />
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
        getRowId={(originalRow: MRT_Row<Major>) => originalRow.id}
      />
    </Box>
  );
}

export default MajorPage;
