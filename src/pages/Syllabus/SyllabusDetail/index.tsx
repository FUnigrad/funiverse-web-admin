import React from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, syllabusApis } from 'src/apis';
import { TableBody, TableRow, TableCell, Paper, Table, Box, Typography } from '@mui/material';
import { Syllabus } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
function transfromSyllabusDetail(data: Syllabus) {
  return {
    name: { label: 'Syllabus Name', value: data.name },
    subjectCode: { label: 'Subject Code', value: data.subject.code },
    noCredit: { label: 'Credit', value: data.noCredit },
    noSlot: { label: 'Slot', value: data.noSlot },
    duration: { label: 'Duration', value: data.duration },
    preRequisite: {
      label: 'Pre-Requisite',
      value: data.preRequisite ? data.preRequisite.map((s) => s.name).join(', ') : '',
    },
    description: { label: 'Description', value: data.description },
    minAvgMarkToPass: { label: 'Min Avg Mark To Pass', value: data.minAvgMarkToPass },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function SyllabusDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKey.Syllabuses, slug],
    queryFn: () => syllabusApis.getSyllabus(slug),
    refetchOnWindowFocus: false,
    select: (data) => transfromSyllabusDetail(data),
    retry: 0,
    enabled: Boolean(slug),
  });

  if (isLoading) return <div>loading ...</div>;
  if (isError) {
    //TODO: Handle error case here
    return <div>This ID does not exist!</div>;
  }
  return (
    <Box>
      <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
        Syllabus Detail
      </Typography>
      <HeaderRowTable data={data} />
    </Box>
  );
}

export default SyllabusDetailPage;
