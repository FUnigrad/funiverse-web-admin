import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Curriculum, CurriculumSyllabus } from 'src/@types';
import { QueryKey, groupApis, curriculumApis, searchApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSelectValue, getPreviousPathSlash } from 'src/utils';
import { useNavigate, useLocation, useParams } from 'react-router';

interface CurriculumFormPageProps {
  defaultValues?: CurriculumFormInputs;
}
const seasonOptions = [
  { value: 'Spring', label: 'Spring' },
  { value: 'Summer', label: 'Summer' },
  { value: 'Fall', label: 'Fall' },
] as const;
// {
//   "schoolYear": "K15",
//   "description": "Curriculum 1",
//   "major": {
//       "id": 1
//   },
//   "specialization": {
//       "id": 1
//   },
//   "startedTerm": {
//       "season": "Fall",
//       "year": "2023"
//   },
//   "noSemester": 9,
//   "active": true
// }
export type CurriculumBody = {
  id?: number;
  schoolYear: string;
  description: string;
  major: { id: number };
  specialization: { id: number };
  startedTerm: { season: string; year: string };
  noSemester: number;
  active: boolean;
};
const CurriculumSchema = z.object({
  schoolYear: z.string().min(1),
  description: z.string(),
  major: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  specialization: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  noSemester: z.coerce.number().positive(),
  season: z
    .string()
    .min(1)
    .or(z.object({ value: z.string().min(1), label: z.string() })),
  year: z.coerce
    .number()
    .positive()
    .refine((value) => value < new Date().getFullYear() + 20 && value > new Date().getFullYear(), {
      message: 'Year must be greater than CURRENT YEAR and less than next 20 years',
    }),
  active: z.boolean(),
});
export type CurriculumFormInputs = z.infer<typeof CurriculumSchema>;

function CurriculumFormPage({
  defaultValues,
}: {
  defaultValues?: CurriculumFormInputs & { id: number };
}) {
  const navigate = useNavigate();
  const { dispatch } = useContext(ModalContext);

  const location = useLocation();

  const mutation = useMutation<Curriculum, unknown, CurriculumBody, unknown>({
    mutationFn: (body) =>
      body.id ? curriculumApis.updateCurriculum(body) : curriculumApis.createCurriculum(body),
    onSuccess: (data) => {
      // navigate(-1);
      dispatch({ type: 'close' });
      if (!defaultValues?.id) navigate(`${data.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CurriculumFormInputs>({
    mode: 'all',
    resolver: zodResolver(CurriculumSchema),
    defaultValues: {
      active: true,
      ...defaultValues,
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: defaultValues?.id
      ? [QueryKey.Curriculums, defaultValues?.id]
      : [QueryKey.Curriculums],
    queryFn: () => curriculumApis.getCurriculum(defaultValues?.id),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: Boolean(defaultValues?.id),
    cacheTime: 0,
    onSuccess: (newData) => {
      // const defaultValues: CurriculumFormInputs = newData
      //   ? {
      //       ...newData,
      //       subject: {
      //         label: newData.subject.name,
      //         value: newData.subject.id,
      //       },
      //     }
      //   : {};
      // reset(defaultValues);
    },
  });
  function handleClose() {
    // navigate(getPreviousPathSlash(location.pathname));
    navigate(-1);
  }
  function onSubmit(data: CurriculumFormInputs) {
    const { season, year, ...rest } = data;
    const body: CurriculumBody = {
      ...rest,
      major: { id: getSelectValue(data.major) },
      specialization: getSelectValue(data.specialization),
      startedTerm: {
        season: getSelectValue(data.season),
        year: `${getSelectValue(data.year)}`,
      },
    } as CurriculumBody;

    if (defaultValues?.id) body.id = defaultValues.id;
    console.log('🚀 ~ data:', body);
    mutation.mutate(body);
  }
  console.log(errors);

  if (isLoading && defaultValues?.id)
    return (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="entityForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%', paddingBottom: 2 },
        // height: 400,
      }}
    >
      <TextField
        label="School Year"
        required
        error={Boolean(errors.schoolYear)}
        helperText={errors.schoolYear?.message}
        {...register('schoolYear')}
      />
      <TextField
        label="Description"
        error={Boolean(errors.description)}
        multiline
        rows={3}
        sx={{ marginBottom: '20px !important' }}
        helperText={errors.description?.message}
        {...register('description')}
      />
      <AsyncSelect
        fieldName="major"
        control={control}
        required
        // isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'major', field: 'name', value: input })
        }
        error={Boolean(errors.major)}
      />
      <AsyncSelect
        fieldName="specialization"
        control={control}
        required
        // isMulti
        promiseOptions={(input) =>
          searchApis.search({ entity: 'specialization', field: 'name', value: input })
        }
        error={Boolean(errors.specialization)}
      />
      <TextField
        label="No. Semester"
        type="number"
        required
        error={Boolean(errors.noSemester)}
        helperText={errors.noSemester?.message}
        {...register('noSemester')}
      />
      <Select
        control={control}
        fieldName="season"
        options={seasonOptions}
        required
        error={Boolean(errors.season) && errors.season.message === 'Required'}
        // defaultValue={defaultValues.type ?? ''}
      />
      <TextField
        label="Year"
        type="number"
        required
        error={Boolean(errors.year)}
        helperText={errors.year?.message}
        {...register('year')}
      />
      <Controller
        name="active"
        control={control}
        render={({ field: { value, ...field } }) => (
          <FormControlLabel
            control={<Checkbox checked={Boolean(value)} {...field} />}
            label="Active"
            labelPlacement="end"
          />
        )}
      ></Controller>
      {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0 16px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box> */}
    </Box>
  );
}

export default CurriculumFormPage;
const CurriculumSyllabusSchema = z.object({
  syllabus: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  semester: z.coerce.number().positive(),
});
type CurriculumSyllabusFormInputs = z.infer<typeof CurriculumSyllabusSchema>;
function CurriculumSyllabusForm({
  defaultValues,
  curriculumId,
}: {
  defaultValues?: any;
  curriculumId: any;
}) {
  const queryClient = useQueryClient();

  const { dispatch } = useContext(ModalContext);
  const mutation = useMutation<CurriculumSyllabus, unknown, any, unknown>({
    mutationFn: (body) =>
      body.id
        ? curriculumApis.updateCurriculumSyllabus(curriculumId, body)
        : curriculumApis.createCurriculumSyllabus(curriculumId, body),
    onSuccess: (data) => {
      dispatch({ type: 'close' });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.Curriculums, curriculumId, QueryKey.Syllabuses],
      });
    },
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: zodResolver(CurriculumSyllabusSchema),
    defaultValues: {
      ...defaultValues,
    },
  });
  console.log('🚀 ~ errors:', errors);
  function onSubmit(data) {
    const body = {
      ...data,
      syllabus: {
        id: getSelectValue(data.syllabus),
      },
    };
    console.log('🚀 ~ body:', body);
    if (defaultValues?.id) body.id = defaultValues.id;
    mutation.mutate(body);
  }
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="entityForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%', paddingBottom: 2 },
        // height: 400,
      }}
    >
      <AsyncSelect
        fieldName="syllabus"
        control={control}
        required
        promiseOptions={(input) =>
          searchApis.search({ entity: 'syllabus', field: 'name', value: input })
        }
        error={Boolean(errors.syllabus)}
      />
      <TextField
        label="Semester"
        type="number"
        required
        error={Boolean(errors.noSemester)}
        helperText={errors.noSemester?.message}
        {...register('semester')}
      />
    </Box>
  );
}
export { CurriculumSyllabusForm };
