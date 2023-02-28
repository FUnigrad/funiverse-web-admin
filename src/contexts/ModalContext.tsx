import { Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useContext, useMemo, useReducer } from 'react';
import { ModalAction, ModalContextValue } from 'src/@types';

export const ModalContext = React.createContext<ModalContextValue>(null);

function reducer(state: Omit<ModalContextValue, 'dispatch'>, action: ModalAction) {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        onConfirm: null,
        onCreateOrSave: action.onCreateOrSave,
      };
    case 'close':
      return { ...state, open: false };
    case 'clear':
      return {
        ...state,
        title: 'Your Popup',
        content: null,
        onConfirm: null,
        onCreateOrSave: null,
      };
    case 'open_confirm':
      return {
        ...state,
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        onConfirm: action.onConfirm,
        onCreateOrSave: null,
      };
    default:
      return state;
  }
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<
    React.Reducer<Omit<ModalContextValue, 'dispatch'>, ModalAction>
  >(reducer, {
    open: false,
    content: null,
    title: 'Deactivate this item',
    onConfirm: null,
    onCreateOrSave: null,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ ...state, open: state.open, dispatch }), [state.open]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

function Modal() {
  const {
    open,
    content: Content,
    dispatch,
    title,
    onConfirm,
    onCreateOrSave,
  } = useContext(ModalContext);
  function handleClose() {
    dispatch({ type: 'close' });
  }

  function handleSubmit() {}

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        <Typography variant="h3" textAlign={'center'}>
          {title}
        </Typography>
      </DialogTitle>
      {/* TODO: delay unmount <Content /> */}
      <DialogContent
        sx={{ width: 500 }}
        // TODO: Not working if pass Content is GroupForm ?
        // onAnimationEnd={(e) => {
        //   e.stopPropagation();
        //   dispatch({ type: 'clear' });
        // }}
      >
        {Content && <Content />}
      </DialogContent>
      <Divider />
      {Boolean(onConfirm) ? (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      ) : (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="submit"
            form="entityForm"
            variant="contained"
            // onClick={onCreateOrSave}
          >
            Deactivate
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Modal;
