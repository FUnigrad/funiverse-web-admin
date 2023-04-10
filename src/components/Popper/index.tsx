import React, { useRef } from 'react';
import Tippy from '@tippyjs/react/headless'; // different import path!
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SearchInput from '../InputSearch';
import { useQuery } from '@tanstack/react-query';
import { QueryKey, userApis } from 'src/apis';
import SuspenseLoader from '../SuspenseLoader';
import { User } from 'src/@types';
function Popper({
  children,
  onSelect,
}: {
  children: React.ReactElement;
  onSelect?: (u: User) => void;
}) {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [QueryKey.Users],
    queryFn: userApis.getUsers,
    refetchOnWindowFocus: false,
  });
  const originalListRef = useRef(data);

  if (isLoading) return <SuspenseLoader />;
  return (
    <Tippy
      interactive={true}
      trigger="click"
      placement="bottom-start"
      render={(attrs) => (
        <Paper
          className="box"
          tabIndex={-1}
          {...attrs}
          sx={{
            p: 2,
            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
            height: 200,
            overflowY: 'auto',
            '::-webkit-scrollbar': { width: '8px' },
            '::-webkit-scrollbar-thumb': {
              background: '#f1f1f1',
            },
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchInput />
          <Box sx={{ mt: 2 }}>
            {data.map((u) => {
              return (
                <Typography
                  variant="body1"
                  fontWeight={600}
                  key={u.id}
                  sx={{ mt: 1 }}
                  onClick={() => onSelect(u)}
                >
                  {u.name}
                </Typography>
              );
            })}
          </Box>
        </Paper>
      )}
    >
      {children}
    </Tippy>
  );
}
export default Popper;
