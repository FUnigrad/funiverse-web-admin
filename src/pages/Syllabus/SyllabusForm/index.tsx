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
import { Group, GroupType, Syllabus } from 'src/@types';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSelectValue, getPreviousPathSlash } from 'src/utils';
import { useNavigate, useLocation, useParams } from 'react-router';
interface SyllabusFormPageProps {
  defaultValues?: SyllabusFormInputs;
}
// {
//   "name": "Syllabus 1",
//   "subject": {
//     "id": 6
//   },
//   "noCredit": 3,
//   "noSlot": 30,
//   "duration": 90,
//   "description": "djsakldjsakl;dasjkdl;as",
//   "minAvgMarkToPass": 4,
//   "active": true
// }
export type SyllabusBody = Omit<SyllabusFormInputs, 'subject'> & {
  id?: number;
  subject: { id: number };
};
const SyllabusSchema = z.object({
  name: z.string().min(1),
  subject: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
  noCredit: z.coerce.number().positive(),
  noSlot: z.coerce.number().positive(),
  duration: z.coerce.number().positive(),
  description: z.string(),
  minAvgMarkToPass: z.coerce.number().positive(),
  active: z.boolean(),
});
type SyllabusFormInputs = z.infer<typeof SyllabusSchema>;
function SyllabusFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const mutation = useMutation<Syllabus, unknown, SyllabusBody, unknown>({
    mutationFn: (body) =>
      body.id ? syllabusApis.updateSyllabus(body) : syllabusApis.createSyllabus(body),
    onSuccess: () => {
      navigate(getPreviousPathSlash(location.pathname));
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
  } = useForm<SyllabusFormInputs>({
    mode: 'all',
    resolver: zodResolver(SyllabusSchema),
    defaultValues: {
      active: true,
      // ...defaultValues,
    },
  });
  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKey.Syllabus, slug],
    queryFn: () => syllabusApis.getSyllabus(slug),
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: Boolean(slug),
    onSuccess: (newData) => {
      const defaultValues: SyllabusFormInputs = newData
        ? {
            ...newData,
            subject: {
              label: newData.subject.name,
              value: newData.subject.id,
            },
          }
        : {};
      reset(defaultValues);
    },
  });
  function handleClose() {
    navigate(getPreviousPathSlash(location.pathname));
  }
  function onSubmit(data: SyllabusFormInputs) {
    const { subject, ...rest } = data;
    const body: SyllabusBody = {
      ...rest,
      //TODO: Enhance type subject here
      subject: { id: getSelectValue(subject as any) as number },
    };
    if (slug) body.id = +slug;
    console.log('🚀 ~ body:', body);
    mutation.mutate(body);
  }

  if (isLoading) return <CircularProgress />;

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
        label="Name"
        required
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <AsyncSelect
        fieldName="subject"
        control={control}
        required
        // isMulti
        promiseOptions={groupApis.getFakedSearch}
        error={Boolean(errors.subject)}
      />
      <TextField
        label="Credit"
        type="number"
        required
        error={Boolean(errors.noCredit)}
        helperText={errors.noCredit?.message}
        {...register('noCredit')}
      />
      <TextField
        label="Slot"
        type="number"
        required
        error={Boolean(errors.noSlot)}
        helperText={errors.noSlot?.message}
        {...register('noSlot')}
      />
      <TextField
        label="Duration"
        type="number"
        required
        error={Boolean(errors.duration)}
        helperText={errors.duration?.message}
        {...register('duration')}
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
      <TextField
        label="Min Avg Mark To Pass"
        type="number"
        required
        error={Boolean(errors.minAvgMarkToPass)}
        helperText={errors.minAvgMarkToPass?.message}
        {...register('minAvgMarkToPass')}
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0 16px' }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default SyllabusFormPage;
