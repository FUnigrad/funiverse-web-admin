import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import Modal, { ModalProvider } from './contexts/ModalContext';
// const queryClient = new QueryClient();
function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <ModalProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          {content}
          <Modal />
        </LocalizationProvider>
      </ModalProvider>
    </ThemeProvider>
  );
}
export default App;
