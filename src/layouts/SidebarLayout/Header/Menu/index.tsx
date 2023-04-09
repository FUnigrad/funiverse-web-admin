import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRef, useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKey } from 'src/apis';
import { termApis } from 'src/apis/termApis';
import { ModalContext } from 'src/contexts/ModalContext';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { useRefState } from 'src/hooks';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`,
);

function HeaderMenu() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { dispatch } = useContext(ModalContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };
  const { data: currentData } = useQuery({
    queryKey: [QueryKey.Terms, 'current'],
    queryFn: () => termApis.getTerm('current'),
    retry: 0,
  });
  const { data: nextData } = useQuery({
    queryKey: [QueryKey.Terms, 'next'],
    queryFn: () => termApis.getTerm('next'),
    cacheTime: 0,
    retry: 0,
  });
  const mutation = useMutation({
    mutationFn: termApis.startNewSemester,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Terms, 'current'] });
      queryClient.invalidateQueries({ queryKey: [QueryKey.Terms, 'next'] });
      dispatch({ type: 'close' });
    },
  });
  const createStartDateMutation = useMutation({
    mutationFn: (body: { startDate: string }) => termApis.createTermStartDate(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.Terms, 'next'] });
      navigate('/term/prepare');
      dispatch({ type: 'close' });
    },
  });
  const startNextDate = dayjs()
    .month(nextData?.season.startMonth - 1)
    .year(+nextData?.year)
    .startOf('month');
  const initDate = nextData?.startDate ? dayjs(nextData.startDate) : startNextDate;
  const [selectedDateRef, setSelectedDate] = useRefState(initDate);
  useEffect(() => {
    if (nextData?.startDate) setSelectedDate(dayjs(nextData?.startDate));
  }, [nextData?.startDate]);

  //TODO: Urgent
  function handleStartNewSemester() {
    if (!nextData) return;
    const {
      season: { startMonth, endMonth },
      year,
      startDate,
    } = nextData;
    const endNextDate = dayjs()
      .month(endMonth - 1)
      .year(+year)
      .endOf('month');
    dispatch({
      type: 'open',
      payload: {
        content: () => (
          <Box>
            <Typography variant="h6" color="initial">
              Current semester is:{' '}
              <b>
                {currentData?.season?.name} {currentData?.year}
              </b>
              . Do you want to prepare{' '}
              <b>
                {nextData?.season?.name} {nextData?.year}
              </b>
              ?
            </Typography>
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                minDate={startNextDate}
                maxDate={endNextDate}
                label="Start date"
                disablePast
                slotProps={{
                  textField: {
                    // helperText: 'MM / DD / YYYY',
                    sx: { width: '100%' },
                  },
                }}
                onChange={(value) => setSelectedDate(value)}
                defaultValue={initDate}
              />
            </DemoContainer>
          </Box>
        ),
        title: 'Prepare new semester',
        saveTitle: 'Prepare',
      },
      onCreateOrSave: () => {
        const date = dayjs(selectedDateRef.current).format('YYYY-MM-DD');
        createStartDateMutation.mutate({ startDate: date });

        // setTimeout(() => {
        //   dispatch({
        //     type: 'open',
        //     payload: {
        //       content: () => (
        //         <Typography variant="h6" color="initial">
        //           Start{' '}
        //           <b>
        //             {nextData?.season?.name} {nextData.year}
        //           </b>{' '}
        //           at <b>{date}</b>?. Doing this action means that you will lost all...
        //         </Typography>
        //       ),
        //       title: 'Confirm start new semester',
        //       saveTitle: 'Confirm',
        //     },
        //     onCreateOrSave: () => {
        //       mutation.mutate({ startDate: date });
        //     },
        //   });
        // }, 0);
      },
    });
  }
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleStartNewSemester}>
        {currentData?.season?.name} {currentData?.year}
      </Button>
      {/* <ListWrapper
        sx={{
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/components/buttons"
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Buttons" />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/components/forms"
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Forms" />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            ref={ref}
            onClick={handleOpen}
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary={
                <Box display="flex" alignItems="center">
                  Others
                  <Box display="flex" alignItems="center" pl={0.3}>
                    <ExpandMoreTwoToneIcon fontSize="small" />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        </List>
      </ListWrapper> */}
      {/* <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/overview">
          Overview
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/tabs">
          Tabs
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/cards">
          Cards
        </MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/components/modals">
          Modals
        </MenuItem>
      </Menu> */}
    </>
  );
}

export default HeaderMenu;
