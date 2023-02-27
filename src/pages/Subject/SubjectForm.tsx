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
const SubjectSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  combo: z.boolean().optional(),
  active: z.boolean(),
  subjects: z.lazy(() => {
    if (!this) return z.array(z.number()).optional();
    // @ts-ignore
    if (this.combo) {
      return z.array(z.number()).min(1);
    } else {
      return z.array(z.number()).optional();
    }
  }),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type SubjectFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type SubjectFormInputs = z.infer<typeof SubjectSchema>;
interface SubjectFormProps {
  defaultValues?: SubjectFormInputs & { id: number };
}
function SubjectForm({ defaultValues }: SubjectFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<SubjectFormInputs>({
    mode: 'all',
    resolver: zodResolver(SubjectSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const watchCombo = watch('combo');
  // console.log('🚀 ~ watchCombo', watchCombo);
  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors, watchCombo]);

  function onSubmit(data) {
    console.log('data: ', defaultValues?.id, data);
  }

  // console.log('🚀 ~ defaultValues', defaultValues);
  // console.log('🚀 ~ errors', errors);

  return (
    <>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="entityForm"
        autoComplete="off"
        noValidate
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
          height: 400,
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
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('code')}
        />
        <Controller
          name="combo"
          control={control}
          render={({ field: { value, ...field } }) => (
            <FormControlLabel
              value="combo"
              control={<Checkbox checked={Boolean(value)} {...field} />}
              label="Combo"
              labelPlacement="end"
            />
          )}
        ></Controller>
        {watchCombo && (
          <AsyncSelect
            fieldName="subjects"
            control={control}
            required
            isMulti
            promiseOptions={groupApis.getFakedSearch}
            error={Boolean(errors.subjects)}
          />
        )}
        <Box />
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
      </Box>
    </>
  );
}
export default SubjectForm;
