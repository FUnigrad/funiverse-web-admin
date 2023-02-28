import { Dispatch } from 'react';
import { Control } from 'react-hook-form';
export type SelectOption = { label: string; value: number | string };

export type Callback = (...args: any[]) => void;
export type ModalAction =
  | {
      type: 'open';
      payload: {
        content: React.FC;
        title: string;
      };
      onCreateOrSave: Callback;
    }
  | {
      type: 'close';
    }
  | {
      type: 'clear';
    }
  | {
      type: 'open_confirm';
      payload: {
        content: React.FC;
        title?: string;
      };
      onConfirm: Callback;
    };

export interface ModalContextValue {
  dispatch: Dispatch<ModalAction>;
  open: boolean;
  content: React.FC;
  title: string;
  onConfirm: Callback;
  onCreateOrSave: Callback;
}

export interface SelectProps {
  control: Control<any, any>;
  fieldName: string;
  options: any;
  error: boolean;
  required: boolean;
}
