import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, UserRole } from 'src/@types';
import { QueryKey, groupApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';

const roleOptions = [
  { value: UserRole.Student, label: 'Student' },
  { value: UserRole.Teacher, label: 'Teacher' },
  { value: UserRole.SystemAdmin, label: 'System Admin' },
  { value: UserRole.DepartmentAdmin, label: 'Department Admin' },
  { value: UserRole.WorkspaceAdmin, label: 'Workspace Admin' },
] as const;
const UserSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  role: z.string().min(1),
  schoolYear: z.string().min(1),
  personalMail: z.string().min(1),
  eduMail: z.string().min(1),
  avatar: z.string().min(1),
  phoneNumber: z.string().min(1),
  curriculum: z.object({ value: z.number(), label: z.string() }).or(z.number()),
  active: z.boolean(),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type UserFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type UserFormInputs = z.infer<typeof UserSchema>;
interface UserFormProps {
  defaultValues?: UserFormInputs & { id: number };
}
function UserForm({ defaultValues }: UserFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<UserFormInputs>({
    mode: 'all',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      active: true,
      role: UserRole.Student,
      ...defaultValues,
    },
  });

  // const watchCombo = watch('combo');
  // console.log('🚀 ~ watchCombo', watchCombo);
  // useEffect(() => {
  //   clearErrors();
  //   return () => {
  //     clearErrors();
  //   };
  // }, [clearErrors, watchCombo]);

  function onSubmit(data) {
    console.log('data: ', defaultValues?.id, data);
  }

  // console.log('🚀 ~ defaultValues', defaultValues);
  console.log('🚀 ~ errors', errors);

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
          height: 500,
        }}
      >
        <TextField
          label="Name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        <Select
          control={control}
          fieldName="role"
          options={roleOptions}
          required
          error={Boolean(errors.role) && errors.role.message === 'Required'}
        />
        <TextField
          label="Code"
          required
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
          {...register('code')}
        />
        <TextField
          label="School Year"
          required
          error={Boolean(errors.schoolYear)}
          helperText={errors.schoolYear?.message}
          {...register('schoolYear')}
        />
        <TextField
          label="Personal E-mail"
          required
          error={Boolean(errors.personalMail)}
          helperText={errors.personalMail?.message}
          {...register('personalMail')}
        />
        <TextField
          label="Education E-mail"
          required
          error={Boolean(errors.eduMail)}
          helperText={errors.eduMail?.message}
          {...register('eduMail')}
        />
        <TextField
          label="Avatar"
          // required
          error={Boolean(errors.avatar)}
          helperText={errors.avatar?.message}
          {...register('avatar')}
        />
        <TextField
          label="Phone Number"
          // required
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <AsyncSelect
          fieldName="curriculum"
          control={control}
          required
          promiseOptions={groupApis.getFakedSearch}
          error={Boolean(errors.curriculum)}
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
      </Box>
    </>
  );
}
export default UserForm;
