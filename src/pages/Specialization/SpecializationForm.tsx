import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType } from 'src/@types';
import { QueryKey, groupApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
const SpecializationSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  major: z
    .number()
    .positive()
    .or(z.object({ value: z.number().positive(), label: z.string() })),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type SpecializationFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type SpecializationFormInputs = z.infer<typeof SpecializationSchema>;
interface SpecializationFormProps {
  defaultValues?: SpecializationFormInputs & { id?: number };
}
function SpecializationForm({ defaultValues }: SpecializationFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<SpecializationFormInputs>({
    mode: 'all',
    resolver: zodResolver(SpecializationSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  function onSubmit(data) {
    console.log('data: ', defaultValues?.id, data);
  }
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="entityForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        height: 300,
      }}
    >
      <TextField
        label="Name"
        required
        error={Boolean(errors.name)}
        helperText={errors.name?.message}
        {...register('name')}
      />
      <TextField
        label="Code"
        required
        error={Boolean(errors.code)}
        helperText={errors.code?.message}
        {...register('code')}
      />
      <AsyncSelect
        fieldName="major"
        control={control}
        required
        // isMulti
        promiseOptions={groupApis.getFakedSearch}
        error={Boolean(errors.major)}
      />
    </Box>
  );
}

export default SpecializationForm;
