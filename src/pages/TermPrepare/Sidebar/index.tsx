import { useContext } from 'react';
import Scrollbar from 'src/components/Scrollbar';
import { SidebarContext } from 'src/contexts/SidebarContext';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { styled, alpha, lighten, darken, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useStepperContext } from 'src/contexts/StepperContext';
import { useNavigate } from 'react-router';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.trueWhite[70]};
        position: relative;
        z-index: 7;
        height: 100%;
        `,
  // padding-bottom: 68px;
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();
  const { activeStep } = useStepperContext();
  const navigate = useNavigate();
  return (
    <>
      <SidebarWrapper
        sx={{
          display: { lg: 'inline-block' },
          position: 'fixed',
          left: 0,
          top: 0,
          background: '#fff',
          boxShadow: '0px 2px 6px 0px #747474',
        }}
      >
        <Box>
          <Box mt={3}>
            <Box mx={2} sx={{ width: 52 }}></Box>
          </Box>
          <Divider
            sx={{
              mt: '40px',
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10],
            }}
          />
          {/* <SidebarMenu /> */}
          <Box sx={{ px: 4, textAlign: 'center' }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Overview</StepLabel>
              </Step>
              <Step>
                <StepLabel>Teacher Assign</StepLabel>
              </Step>
              <Step>
                <StepLabel>Slots</StepLabel>
              </Step>
            </Stepper>
            <Button variant="outlined" color="primary" sx={{ mt: 3 }} onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </Box>
        </Box>
      </SidebarWrapper>
    </>
  );
}

export default Sidebar;
