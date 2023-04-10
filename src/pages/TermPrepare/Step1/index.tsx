import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/apis';
import { termApis } from 'src/apis/termApis';
import Box from '@mui/material/Box';
import { useRefState } from 'src/hooks';
import SuspenseLoader from 'src/components/SuspenseLoader';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { useFieldArray, useForm } from 'react-hook-form';
import { PrepareGroup, User } from 'src/@types';
import TextField from '@mui/material/TextField';
import { useTheme, styled } from '@mui/material/styles';
import Select from 'src/components/Select';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import Popper from 'src/components/Popper';
import { useStepperContext } from 'src/contexts/StepperContext';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  // border: `1px solid ${theme.palette.divider}`,
  border: 'none !important',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  // backgroundColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, .05)'
  //     : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
const options = [
  { label: 'test0', value: 0 },
  { label: 'test1', value: 1 },
];
const dayOptions = [
  { label: 'dayOptions0', value: 0 },
  { label: 'dayOptions1', value: 1 },
];
function Step1() {
  // const { data: nextData, isLoading } = useQuery({
  //   queryKey: [QueryKey.Terms, 'next'],
  //   queryFn: () => termApis.getTerm('next'),
  // });
  // const [selectedDateRef, setSelectedDate] = useRefState();
  // const [groupInputs, setGroupInputs] = useState<Record<string, { id: string }[]>>();
  const theme = useTheme();
  const { data: prepareGroups, isLoading } = useQuery({
    queryKey: [QueryKey.Terms, QueryKey.Prepare, QueryKey.Groups],
    queryFn: termApis.getGroups,
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    unregister,
    clearErrors,
    formState: { errors },
  } = useForm({});
  const { fields, insert, append, remove } = useFieldArray({
    control,
    name: 'slot',
  });
  const [selectedTeachers, setSelectedTeachers] = useState<{ groupId: number; teacher: User }[]>(
    [],
  );
  const { dispatchStepper } = useStepperContext();

  if (isLoading)
    return (
      <Box>
        <SuspenseLoader />
      </Box>
    );

  function handleAddSlotClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    group: PrepareGroup,
  ) {
    event.stopPropagation();
    const gid = group.id;
    append({ gid, order: '', day: '', room: '' });
  }

  function handleDeleteInputClick(group: PrepareGroup, index: number) {
    remove(index);
  }

  function onSubmit(data) {
    console.log(data);
  }
  function handleSelect(group: PrepareGroup, user: User) {
    const selected = { groupId: group.id, teacher: user };
    const existedTeacherIndex = selectedTeachers.findIndex(
      ({ groupId, teacher }) => groupId === group.id,
    );
    if (existedTeacherIndex === -1) {
      setSelectedTeachers([...selectedTeachers, selected]);
    } else {
      const newTeachers = [...selectedTeachers];
      newTeachers[existedTeacherIndex] = selected;
      setSelectedTeachers(newTeachers);
    }
  }
  // const groupIds = groupInputs && Object.keys(groupInputs).map(Number);
  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component="form"
      id="slotsForm"
      autoComplete="off"
      noValidate
      sx={{
        '& .MuiTextField-root': { m: 1, width: '100%' },
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {prepareGroups.map((g) => (
          <Accordion
            key={g.id}
            defaultExpanded
            sx={{
              border: `1px solid ${theme.colors.alpha.black[30]}`,
              '& .MuiAccordionSummary-root': { pt: 1 },
            }}
          >
            <AccordionSummary>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography variant="h5" color="initial">
                  {g.name}
                </Typography>
                <Box sx={{ ml: 'auto' }}>
                  <Popper onSelect={(user) => handleSelect(g, user)}>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        py: '4px',
                        '&:hover': {
                          // background: 'unset',
                          // textDecoration: 'underline',
                        },
                      }}
                    >
                      {selectedTeachers.find((t) => t.groupId === g.id)
                        ? `${selectedTeachers.find((t) => t.groupId === g.id).teacher.name}`
                        : 'Select Teacher'}
                    </Button>
                  </Popper>
                  <Button
                    sx={{
                      py: '7px',
                      '&:hover': {
                        // background: 'unset',
                        // textDecoration: 'underline',
                      },
                    }}
                    variant="text"
                    color="primary"
                    startIcon={<AddOutlined />}
                    size="small"
                    onClick={(e) => handleAddSlotClick(e, g)}
                  >
                    Add slot
                  </Button>
                </Box>
              </Box>
            </AccordionSummary>
            <Box sx={{ px: 2 }}>
              {fields.map(
                (gI, index) =>
                  g.id === (gI as any).gid && (
                    <Box
                      key={`${gI.id}`}
                      sx={{ display: 'flex', alignItems: 'center', gap: '0 24px' }}
                    >
                      <Select
                        control={control}
                        options={options}
                        fieldName={`slot[${index}].order`}
                        required
                        error={false}
                        size="small"
                        label="Order"
                      />
                      <Select
                        control={control}
                        options={dayOptions}
                        fieldName={`slot[${index}].day`}
                        required
                        error={false}
                        size="small"
                        label="Day of week"
                      />
                      <TextField
                        id="room"
                        label="Room"
                        size="small"
                        sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
                        {...register(`slot[${index}].room`)}
                      />
                      <IconButton
                        onClick={() => handleDeleteInputClick(g, index)}
                        size="small"
                        sx={{ borderRadius: '50%' }}
                        color="secondary"
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                  ),
              )}
            </Box>
          </Accordion>
        ))}
        {/* <Button variant="outlined" color="primary" type="submit">
          submit
        </Button> */}
      </Box>
    </Box>
  );
}

export default Step1;
