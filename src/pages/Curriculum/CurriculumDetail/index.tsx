import React, { useMemo, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, curriculumApis, syllabusApis } from 'src/apis';
import {
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Box,
  Typography,
  Link as MuiLink,
  Checkbox,
  Button,
} from '@mui/material';
import { Curriculum, CurriculumSyllabus } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
import Table from 'src/components/Table';
import { syllabusData } from 'src/__mock__';
import { MRT_Row, MRT_ColumnDef } from 'material-react-table';
import { Add, EditOutlined } from '@mui/icons-material';
import CurriculumFormPage, {
  CurriculumFormInputs,
  CurriculumSyllabusForm,
} from '../CurriculumForm';
import { ModalContext } from 'src/contexts/ModalContext';
import { generateOptions } from 'src/utils';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import AsyncSelect from 'src/components/AsyncSelect';
import { zodResolver } from '@hookform/resolvers/zod';

function transfromCurriculumDetail(data: Curriculum) {
  return {
    code: { label: 'Curriculum Code', value: data.code },
    name: { label: 'Name', value: data.name },
    currentSemester: { label: 'Current Semester', value: data.currentSemester },
    schoolYear: { label: 'School Year', value: data.schoolYear },
    description: { label: 'Description', value: data.description },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function CurriculumDetailPage() {
  const columns = useMemo<MRT_ColumnDef<CurriculumSyllabus>[]>(
    () => [
      {
        header: 'Subject Code',
        accessorKey: 'syllabus.code',
      },
      {
        header: 'Name',
        accessorKey: 'syllabus.name',
        Cell: ({ cell, row }) => (
          <MuiLink component={Link} to={`/syllabi/${row.id}`}>
            {cell.getValue<string>()}
          </MuiLink>
        ),
        enableHiding: false,
      },
      {
        header: 'Semester',
        accessorKey: 'semester',
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
  const { dispatch } = useContext(ModalContext);
  const { slug } = useParams();

  const curriculumDetailQuery = useQuery({
    queryKey: [QueryKey.Curricula, 'slug'],
    queryFn: () => curriculumApis.getCurriculum(slug),
    refetchOnWindowFocus: false,
    // select: (data) => transfromCurriculumDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  const curriculumSyllabusQuery = useQuery({
    queryKey: [QueryKey.Curricula, slug, QueryKey.Syllabi],
    queryFn: () => curriculumApis.getCurriculumSyllabuses(slug),
    refetchOnWindowFocus: false,
  });

  function onEditCurriculum() {
    const original = curriculumDetailQuery.data;
    // const defaultValues = {};

    const defaultValues = {
      id: original.id,
      schoolYear: original.schoolYear,
      description: original.description,
      major: generateOptions({ data: original.major, valuePath: 'id', labelPath: 'name' }),
      specialization: generateOptions({
        data: original.specialization,
        valuePath: 'id',
        labelPath: 'name',
      }),
      noSemester: original.noSemester,
      season: {
        label: original.startedTerm?.season ?? '',
        value: original.startedTerm?.season ?? '',
      },
      year: { label: original.startedTerm?.year ?? '', value: original.startedTerm?.year ?? '' },
      active: original.active,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Curriculum',
        content: () => <CurriculumFormPage defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onAddCurriculumSyllabus() {
    console.log('🚀 ~ slug:', slug);
    dispatch({
      type: 'open',
      payload: {
        title: 'Add Syllabus into Curriculum',
        content: () => <CurriculumSyllabusForm curriculumId={slug} />,
      },
      onCreateOrSave: () => {},
    });
  }
  function onEditCurriculumSyllabus(row: MRT_Row<CurriculumSyllabus>) {
    const { original } = row;
    const defaultValues = {
      id: original.syllabus.id,
      syllabus: { label: original.syllabus.name, value: original.syllabus.id },
      semester: original.semester,
    };
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Syllabus in Curriculum',
        content: () => (
          <CurriculumSyllabusForm curriculumId={slug} defaultValues={defaultValues as any} />
        ),
      },
      onCreateOrSave: () => {},
    });
  }
  function onDeleteEntity() {}
  if (curriculumDetailQuery.isLoading) return <div>loading ...</div>;
  if (curriculumDetailQuery.isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Curriculum Detail
        </Typography>
        <Button startIcon={<EditOutlined />} variant="contained" onClick={onEditCurriculum}>
          Edit
        </Button>
      </Box>
      <HeaderRowTable data={transfromCurriculumDetail(curriculumDetailQuery.data)} />
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', m: '24px 0' }}
      >
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Curriculum Plan
        </Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onAddCurriculumSyllabus}>
          Add syllabus
        </Button>
      </Box>
      <Table
        columns={columns}
        data={curriculumSyllabusQuery.data}
        onEditEntity={onEditCurriculumSyllabus}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading: curriculumSyllabusQuery.isLoading,
          showAlertBanner: curriculumSyllabusQuery.isError,
          showProgressBars: curriculumSyllabusQuery.isFetching,
        }}
        getRowId={(originalRow: MRT_Row<CurriculumSyllabus>) =>
          (originalRow as any).syllabus?.id ?? originalRow.id
        }
      />
    </Box>
  );
}

export default CurriculumDetailPage;
