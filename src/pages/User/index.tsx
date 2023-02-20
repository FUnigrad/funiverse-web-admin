import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { User, GroupType } from 'src/@types';
import { QueryKey, groupApis, userApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import UserForm from './UserForm';
import { generateOptions } from 'src/utils';

function UserPage() {
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<User>[]>(
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
        header: 'E-mail',
        accessorKey: 'eduMail',
      },
      {
        header: 'Role',
        accessorKey: 'role',
      },
      {
        header: 'Phone Number',
        accessorKey: 'phoneNumber',
      },
      // {
      //   header: 'School Year',
      //   accessorKey: 'schoolYear',
      // },
      {
        header: 'Active',
        accessorKey: 'active',
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
        title: 'Create User',
        content: () => <UserForm />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<User>) {
    const { original } = row;
    console.log(
      '🚀 ~ row:',
      generateOptions({
        data: original.curriculum,
        valuePath: 'id',
        labelPath: 'code',
      }),
    );
    const defaultValues = {
      name: original.name,
      code: original.code,
      role: original.role,
      schoolYear: original.schoolYear,
      personalMail: original.personalMail,
      eduMail: original.eduMail,
      avatar: original.avatar,
      phoneNumber: original.phoneNumber,
      curriculum: generateOptions({
        data: original.curriculum,
        valuePath: 'id',
        labelPath: 'code',
      }),
      active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit User',
        content: () => <UserForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity(row: MRT_Row<User>) {
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
    queryKey: [QueryKey.User],
    queryFn: userApis.getUsers,
    refetchOnWindowFocus: false,
  });
  return (
    <Box>
      <ListPageHeader entity="user" onCreateEntity={onCreateEntity} />
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
        getRowId={(originalRow: MRT_Row<User>) => originalRow.id}
      />
    </Box>
  );
}

export default UserPage;
