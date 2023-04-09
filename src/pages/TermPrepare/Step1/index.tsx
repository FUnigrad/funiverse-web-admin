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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddCircleOutlined from '@mui/icons-material/AddCircleOutlined';
import { useFieldArray, useForm } from 'react-hook-form';
import { PrepareGroup } from 'src/@types';
import TextField from '@mui/material/TextField';
import Select from 'src/components/Select';

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
  const [groupInputs, setGroupInputs] = useState<any>();

  const { data: prepareGroups, isLoading } = useQuery({
    queryKey: [QueryKey.Terms, QueryKey.Prepare, QueryKey.Groups],
    queryFn: termApis.getGroups,
    onSuccess: (response) => {
      /**
       * {
       *  [input1, 2, 3,]
       *  [input1, 2, 3,]
       *  [input1, 2, 3,]
       * {
       */
      const groupInputs = response.reduce((result, g) => {
        return { ...result, [g.id]: [] };
      }, {});
      setGroupInputs(groupInputs);
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
  } = useForm({});
  // const orderArray = useFieldArray({
  //   control,
  //   name: 'order',
  // });
  // const dayArray = useFieldArray({
  //   control,
  //   name: 'day',
  // });
  const slotArray = useFieldArray({
    control,
    name: 'slot',
  });
  if (isLoading)
    return (
      <Box>
        <SuspenseLoader />
      </Box>
    );

  function handleAddSlotClick(group: PrepareGroup) {
    const gid = group.id;
    const inputs = groupInputs[gid];
    const newGroupInputs = { ...groupInputs, [gid]: [...inputs, {}] };
    setGroupInputs(newGroupInputs);
  }

  function onSubmit(data) {
    console.log(data);
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
        width: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {prepareGroups.map((g) => (
          <Accordion key={g.id} defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h5" color="initial">
                {g.name}
              </Typography>
            </AccordionSummary>
            <Box>
              {groupInputs &&
                groupInputs[g.id]?.map((gI, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '0 10px' }}>
                    <Select
                      control={control}
                      options={options}
                      fieldName={`slot[${index}][${g.id}].order`}
                      required
                      error={false}
                      size="small"
                      label="Order"
                      // {...register(`order.${index}`)}
                    />
                    <Select
                      control={control}
                      options={dayOptions}
                      fieldName={`slot[${index}][${g.id}].day`}
                      required
                      error={false}
                      size="small"
                      label="Day of week"
                      // {...register(`day.${index}`)}
                    />
                    <TextField
                      id="room"
                      label="Room"
                      size="small"
                      sx={{ '&.MuiFormControl-root': { minHeight: 38 } }}
                      {...register(`slot[${index}][${g.id}].room`)}
                    />
                  </Box>
                ))}
            </Box>
            <Button
              sx={{
                py: 0,
                '&:hover': {
                  background: 'unset',
                  textDecoration: 'underline',
                },
              }}
              variant="text"
              color="primary"
              startIcon={<AddCircleOutlined />}
              size="small"
              onClick={() => handleAddSlotClick(g)}
            >
              Add slot
            </Button>
          </Accordion>
        ))}
        <Button variant="outlined" color="primary" type="submit">
          submit
        </Button>
      </Box>
    </Box>
  );
}

export default Step1;
