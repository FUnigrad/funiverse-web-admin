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
const MajorSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type MajorFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type MajorFormInputs = z.infer<typeof MajorSchema>;
interface MajorFormProps {
  defaultValues?: MajorFormInputs & { id?: number };
}
function MajorForm({ defaultValues }: MajorFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<MajorFormInputs>({
    mode: 'all',
    resolver: zodResolver(MajorSchema),
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
        height: 200,
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
    </Box>
  );
}

export default MajorForm;
