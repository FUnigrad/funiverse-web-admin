import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, majorApis, syllabusApis } from 'src/apis';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EditOutlined from '@mui/icons-material/EditOutlined';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { GroupType, Syllabus, Major, GroupUser } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
// import SyllabusFormPage from '../SyllabusForm';
import { ModalContext } from 'src/contexts/ModalContext';
import MajorForm from './MajorForm';
import Table from 'src/components/Table';
import { MRT_ColumnDef, MRT_Row } from 'material-react-table';
import SpecializationForm from './Specialization/SpecializationForm';

function transfromGroupDetail(data: Major) {
  return {
    code: { label: 'Code', value: data.code },
    name: { label: 'Name', value: data.name },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function MajorDetailPage() {
  const { slug } = useParams();
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<GroupUser>[]>(
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
      // {
      //   header: 'Active',
      //   accessorKey: 'active',
      //   enableSorting: false,
      //   Cell: ({ cell }) => (
      //     <Checkbox disableRipple disableTouchRipple checked={cell.getValue<boolean>()} readOnly />
      //   ),
      // },
    ],
    [],
  );

  const {
    data: majorDetailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QueryKey.Majors, 'slug'],
    queryFn: () => majorApis.getMajor(slug),
    retry: 0,
    enabled: Boolean(slug),
  });
  // const groupUsersQuery = useQuery({
  //   queryKey: [QueryKey.Majors, 'slug', 'specialization'],
  //   queryFn: () => majorApis.getGroupUsers(slug),
  //   retry: 0,
  //   enabled: Boolean(slug),
  // });

  function onEditMajor() {
    const original = majorDetailData;
    const defaultValues = {
      id: original.id,
      name: original.name,
      code: original.code,
      active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Major',
        content: () => <MajorForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onAddSpecialization() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Specialization',
        // content: () => <SubjectForm defaultValues={{ ...(defaultValues as any) }} />,
        content: () => <SpecializationForm />,
      },
      onCreateOrSave: () => {},
    });
  }
  // function onEditSpecialization() {
  //   const { original } = row;
  //   const defaultValues = {
  //     id: original.id,
  //     name: original.name,
  //     code: original.code,
  //     active: original.active,
  //     major: { value: original.major.id, label: original.major.name },
  //   };
  //   dispatch({
  //     type: 'open',
  //     payload: {
  //       title: 'Edit Specialization',
  //       content: () => <SpecializationForm defaultValues={{ ...(defaultValues as any) }} />,
  //       // content: () => <SubjectForm defaultValues />,
  //     },
  //     onCreateOrSave: () => {},
  //   });
  // }

  if (isLoading) return <div>loading ...</div>;
  if (isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Major Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditMajor}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromGroupDetail(majorDetailData)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Specializations
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddSpecialization}>
          Add specialization
        </Button>
      </Box>
      {/* <Table
        columns={columns}
        data={groupUsersQuery.data}
        // onEditEntity={onEditCurriculumSyllabus}
        // onDeleteEntity={onDeleteEntity}
        state={{
          isLoading: groupUsersQuery.isLoading,
          showAlertBanner: groupUsersQuery.isError,
          showProgressBars: groupUsersQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<GroupUser>) => originalRow.id}
      /> */}
    </Box>
  );
}

export default MajorDetailPage;
