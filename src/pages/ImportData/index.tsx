import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
// import Select from 'react-select';
import { Group, GroupType, Season } from 'src/@types';
import { QueryKey, groupApis, syllabusApis, seasonApis } from 'src/apis';
import AsyncSelect from 'src/components/AsyncSelect';
import ListPageHeader from 'src/components/ListEntityPage/ListPageHeader';
import Select from 'src/components/Select';
import Table from 'src/components/Table';
import { ModalContext } from 'src/contexts/ModalContext';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateOptions } from 'src/utils';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Button from '@mui/material/Button';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

function SeasonPage() {
  const { dispatch } = useContext(ModalContext);

  const queryClient = useQueryClient();

  // const { data, isLoading, isError, isFetching } = useQuery({
  //   queryKey: [QueryKey.Seasons],
  //   queryFn: seasonApis.getSeasons,
  //   refetchOnWindowFocus: false,
  // });

  // const mutation = useMutation({
  //   mutationFn: (id) => seasonApis.deleteSeason(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QueryKey.Seasons] });
  //     toast.success(`Delete Season successfully!`);
  //     dispatch({ type: 'close' });
  //   },
  // });
  // const columns = useMemo<MRT_ColumnDef<Season>[]>(
  //   () => [
  //     {
  //       header: 'Name',
  //       accessorKey: 'name',
  //       Cell: ({ cell, row }) => (
  //         <MuiLink component={Link} to={`${row.id}`}>
  //           {cell.getValue<string>()}
  //         </MuiLink>
  //       ),
  //       enableHiding: false,
  //     },
  //     {
  //       header: 'Ordinal number',
  //       accessorKey: 'ordinalNumber',
  //     },
  //     {
  //       header: 'Start month',
  //       accessorKey: 'startMonth',
  //     },
  //     {
  //       header: 'End month',
  //       accessorKey: 'endMonth',
  //     },
  //   ],
  //   [],
  // );
  function onCreateEntity() {}

  return (
    <Box>
      <Helmet>
        <title>FUniverse | Data</title>
      </Helmet>
      <Paper sx={{ p: 2, marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3" component="h3" gutterBottom sx={{ textTransform: 'capitalize' }}>
          Data
        </Typography>
        <Box sx={{ display: 'flex', gap: '0 10px' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadOutlinedIcon fontSize="small" />}
            component="label"
          >
            Import
            <input hidden accept="*" multiple type="file" />
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadOutlinedIcon fontSize="small" />}
            component="label"
          >
            Load template
            <input hidden accept="*" multiple type="file" />
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default SeasonPage;
