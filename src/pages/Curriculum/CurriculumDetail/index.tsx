import React from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { QueryKey, groupApis, curriculumApis } from 'src/apis';
import { TableBody, TableRow, TableCell, Paper, Table, Box, Typography } from '@mui/material';
import { Curriculum } from 'src/@types';
import HeaderRowTable from 'src/components/HeaderRowTable';
import { AxiosResponse } from 'axios';
function transfromCurriculumDetail(data: Curriculum) {
  return {
    code: { label: 'Curriculum Code', value: data.code },
    name: { label: 'Name', value: data.name },
    schoolYear: { label: 'School Year', value: data.schoolYear },
    description: { label: 'Description', value: data.description },
    active: { label: 'Active', value: `${data.active}` },
  };
}

function CurriculumDetailPage() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QueryKey.Curriculums, slug],
    queryFn: () => curriculumApis.getCurriculum(slug),
    refetchOnWindowFocus: false,
    select: (data) => transfromCurriculumDetail(data),
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
        Curriculum Detail
      </Typography>
      {/* <HeaderRowTable data={data} /> */}
    </Box>
  );
}

export default CurriculumDetailPage;
