import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, User } from 'src/@types';
import { QueryKey, groupApis, userApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

function UserPage() {
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
  function onCreateEntity() {}
  function onEditEntity() {}
  function onDeleteEntity() {}
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
