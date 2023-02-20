import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Subject } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { subjectApis } from 'src/apis';
import SubjectForm, { SubjectFormInputs } from './SubjectForm';
import { generateOptions } from 'src/utils';

function SubjectPage() {
  const { dispatch } = useContext(ModalContext);

  const columns = useMemo<MRT_ColumnDef<Subject>[]>(
    () => [
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
        header: 'Code',
        accessorKey: 'code',
      },
      {
        header: 'Combo',
        accessorKey: 'combo',
        enableSorting: false,
        Cell: ({ cell }) => (
          <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
        ),
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
        title: 'Create Group',
        // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        content: () => <SubjectForm />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<Subject>) {
    const { original } = row;
    const defaultValues = {
      id: original.id,
      name: original.name,
      code: original.code,
      combo: original.combo,
      subjects: original.subjects
        ? generateOptions({ data: original.subjects, valuePath: 'id', labelPath: 'code' })
        : null,
      active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Group',
        content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        // content: () => <SubjectForm defaultValues />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity(row: MRT_Row<Subject>) {
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
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Subject],
    queryFn: subjectApis.getSubjects,
    refetchOnWindowFocus: false,
  });
  return (
    <Box>
      <ListPageHeader entity="subject" onCreateEntity={onCreateEntity} />
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
        getRowId={(originalRow: MRT_Row<Subject>) => originalRow.id}
      />
    </Box>
  );
}

export default SubjectPage;
