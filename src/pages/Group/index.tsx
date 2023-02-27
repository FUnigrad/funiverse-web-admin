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
import GroupForm, { GroupFormInputs } from './GroupForm';
// class || department || course
// class: name, curriculum
// department: name
// course: syllabus, class // WARN: Syllabus code - Class

function GroupPage() {
  const { dispatch } = useContext(ModalContext);
  const columns = useMemo<MRT_ColumnDef<Group>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Type',
        accessorKey: 'type',
      },
      {
        header: 'Curriculum',
        accessorKey: 'curriculum.name',
      },
      {
        header: 'Syllabus',
        accessorKey: 'syllabus.id',
      },
      {
        header: 'Teacher',
        accessorKey: 'teacher.name',
      },
    ],
    [],
  );

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Groups],
    queryFn: groupApis.getGroups,
    refetchOnWindowFocus: false,
  });

  function onCreateEntity() {
    dispatch({
      type: 'open',
      payload: {
        title: 'Create Group',
        content: () => <GroupForm />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onEditEntity(row: MRT_Row<Group>) {
    if (!row) return;
    const { original } = row;
    console.log(row.original);
    let defaultValues: Partial<GroupFormInputs & { id: number }> = {
      id: +row.id,
      type: original.type as any,
    };
    switch (original.type) {
      case GroupType.Class:
        defaultValues = {
          ...defaultValues,
          name: original.name,
          curriculum: { label: original.curriculum.code, value: original.curriculum.id },
        };
        break;
      case GroupType.Course:
        defaultValues = {
          ...defaultValues,
          syllabus: { value: original.syllabus.id, label: 'TODO: Add syllabus code' },
          class: { value: 1, label: 'TODO: ....' },
          teacher: { value: original.teacher.id, label: original.teacher.name },
        };
        break;
      case GroupType.Department:
      case GroupType.Normal:
        defaultValues = {
          ...defaultValues,
          name: original.name,
        };
        break;
    }
    dispatch({
      type: 'open',
      payload: {
        title: 'Edit Group',
        content: () => <GroupForm defaultValues={{ ...(defaultValues as any) }} />,
      },
      onCreateOrSave: () => {},
    });
  }

  function onDeleteEntity(row: MRT_Row<Group>) {
    if (!row) return;

    dispatch({
      type: 'open_confirm',
      onConfirm: () => {},
      payload: {
        title: 'Delete this item',
        content: () => (
          <Typography variant="body1">
            Are you sure you want to delete {row.original.name}?
          </Typography>
        ),
      },
    });
  }
  return (
    <Box>
      <ListPageHeader entity="group" onCreateEntity={onCreateEntity} />
      <Table
        columns={columns}
        data={data}
        onEditEntity={onEditEntity}
        onDeleteEntity={onDeleteEntity}
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isFetching,
        }}
        getRowId={(originalRow: MRT_Row<Group>) => originalRow.id}
      />
    </Box>
  );
}

export default GroupPage;
// interface GroupFormProps {
//   defaultValues?: GroupFormInputs & { id: number };
// }
// function GroupForm({ defaultValues }: GroupFormProps) {
//   const { dispatch, onConfirm, onCreateOrSave } = useContext(ModalContext);

//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     unregister,
//     clearErrors,
//     formState: { errors },
//   } = useForm<GroupFormInputs>({
//     mode: 'all',
//     resolver: zodResolver(GroupSchema),
//     defaultValues: {
//       ...defaultValues,
//     },
//   });

//   const watchType = watch('type');
//   // console.log('🚀 ~ watchType', watchType);
//   useEffect(() => {
//     clearErrors();
//     return () => {
//       clearErrors();
//     };
//   }, [clearErrors, watchType]);

//   function onSubmit(data) {
//     console.log('data: ', defaultValues?.id, data);
//   }

//   // console.log('🚀 ~ defaultValues', defaultValues);
//   // console.log('🚀 ~ errors', errors);

//   return (
//     <>
//       <Box
//         onSubmit={handleSubmit(onSubmit)}
//         component="form"
//         id="entityForm"
//         autoComplete="off"
//         noValidate
//         sx={{
//           '& .MuiTextField-root': { m: 1, width: '100%' },
//           height: 400,
//         }}
//       >
//         <Select
//           control={control}
//           fieldName="type"
//           options={typeOptions}
//           required
//           error={Boolean(errors.type) && errors.type.message === 'Required'}
//           // defaultValue={defaultValues.type ?? ''}
//         />
//         {watchType !== GroupType.Course && (
//           <TextField
//             label="Name"
//             required
//             error={Boolean(errors.name)}
//             helperText={errors.name?.message}
//             {...register('name')}
//           />
//         )}
//         {watchType === GroupType.Class && (
//           <AsyncSelect
//             fieldName="curriculum"
//             control={control}
//             required
//             promiseOptions={groupApis.getFakedSearch}
//             error={Boolean(errors.curriculum)}
//           />
//         )}

//         {watchType === GroupType.Course && (
//           <>
//             <AsyncSelect
//               fieldName="syllabus"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.syllabus)}
//             />
//             <AsyncSelect
//               fieldName="class"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.class)}
//             />
//             <AsyncSelect
//               fieldName="teacher"
//               control={control}
//               required
//               promiseOptions={groupApis.getFakedSearch}
//               error={Boolean(errors.teacher)}
//             />
//           </>
//         )}
//       </Box>
//     </>
//   );
// }
