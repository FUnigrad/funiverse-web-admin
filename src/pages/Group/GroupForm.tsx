import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Typography } from '@mui/material';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
const typeOptions = [
  { value: GroupType.Class, label: 'Class' },
  { value: GroupType.Course, label: 'Course' },
  { value: GroupType.Department, label: 'Department' },
  { value: GroupType.Normal, label: 'Normal' },
] as const;
const options = typeOptions.map((t) => t.value);

const nameSchema = z.string().min(1);
const asyncSelectSchema = z
  .number()
  .positive()
  .or(z.object({ value: z.number().positive(), label: z.string() }));
const classSchema = z.object({
  name: nameSchema,
  curriculum: asyncSelectSchema,
});

const courseSchema = z.object({
  syllabus: asyncSelectSchema,
  class: asyncSelectSchema,
  teacher: asyncSelectSchema,
});

const departmentSchema = z.object({
  name: nameSchema,
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type GroupFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type GroupFormInputs = z.infer<typeof classSchema> &
  z.infer<typeof courseSchema> & { type: typeof options[number] };
const GroupSchema = z.union([
  z.object({ type: z.literal(GroupType.Class) }).and(classSchema),
  z.object({ type: z.literal(GroupType.Course) }).and(courseSchema),
  z.object({ type: z.literal(GroupType.Department) }).and(departmentSchema),
]);
interface GroupFormProps {
  defaultValues?: GroupFormInputs & { id: number };
}
function GroupForm({ defaultValues }: GroupFormProps) {
  const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm<GroupFormInputs>({
    mode: 'all',
    resolver: zodResolver(GroupSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const watchType = watch('type');
  // console.log('🚀 ~ watchType', watchType);
  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors, watchType]);

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
        <Select
          control={control}
          fieldName="type"
          options={typeOptions}
          required
          error={Boolean(errors.type) && errors.type.message === 'Required'}
          // defaultValue={defaultValues.type ?? ''}
        />
        {watchType !== GroupType.Course && (
          <TextField
            label="Name"
            required
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register('name')}
          />
        )}
        {watchType === GroupType.Class && (
          <AsyncSelect
            fieldName="curriculum"
            control={control}
            required
            promiseOptions={groupApis.getFakedSearch}
            error={Boolean(errors.curriculum)}
          />
        )}

        {watchType === GroupType.Course && (
          <>
            <AsyncSelect
              fieldName="syllabus"
              control={control}
              required
              promiseOptions={groupApis.getFakedSearch}
              error={Boolean(errors.syllabus)}
            />
            <AsyncSelect
              fieldName="class"
              control={control}
              required
              promiseOptions={groupApis.getFakedSearch}
              error={Boolean(errors.class)}
            />
            <AsyncSelect
              fieldName="teacher"
              control={control}
              required
              promiseOptions={groupApis.getFakedSearch}
              error={Boolean(errors.teacher)}
            />
          </>
        )}
      </Box>
    </>
  );
}
export default GroupForm;
