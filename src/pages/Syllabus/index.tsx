import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, Checkbox, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
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
import { useQuery, useMutation } from '@tanstack/react-query';

function SyllabusPage() {
  const columns = useMemo<MRT_ColumnDef<Syllabus>[]>(
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
        header: 'Description',
        accessorKey: 'description',
      },
      {
        header: 'No credit',
        accessorKey: 'noCredit',
      },
      {
        header: 'Min Avg',
        accessorKey: 'minAvgMarkToPass',
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
  function onCreateEntity() {}
  function onEditEntity() {}
  function onDeleteEntity() {}
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Syllabus],
    queryFn: syllabusApis.getSyllabuses,
    refetchOnWindowFocus: false,
  });
  return (
    <Box>
      <ListPageHeader entity="syllabus" onCreateEntity={onCreateEntity} />
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
        getRowId={(originalRow: MRT_Row<Syllabus>) => originalRow.id}
      />
    </Box>
  );
}

export default SyllabusPage;
