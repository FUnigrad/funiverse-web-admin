import { Dispatch, FC, Reducer, createContext, useContext, useMemo, useReducer } from 'react';

type StepperContextValue = {
  activeStep: StepEnum;
  dispatchStepper: Dispatch<StepperAction>;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
};
type StepperContextReducer = Omit<StepperContextValue, 'dispatchStepper'>;
type StepperAction =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'change_status'; payload: StepperContextValue['status'] };
export enum StepEnum {
  Step1,
  Step2,
  Step3,
}
export const StepperLength = Object.keys(StepEnum).filter((v) => isNaN(v as any)).length;
export const StepperContext = createContext<StepperContextValue>({} as StepperContextValue);
function stepperReducer(state: StepperContextReducer, action: StepperAction) {
  switch (action.type) {
    case 'next':
      return { ...state, activeStep: ++state.activeStep };
    case 'back':
      return { ...state, activeStep: --state.activeStep };
    case 'change_status':
      return { ...state, status: action.payload };
    default:
      return state;
  }
}
export const StepperProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<StepperContextReducer, StepperAction>>(
    stepperReducer,
    { activeStep: StepEnum.Step1, status: 'idle' },
  );
  const value = useMemo(
    () => ({ ...state, dispatchStepper: dispatch }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.activeStep, state.status],
  );
  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
};
export function useStepperContext() {
  return useContext(StepperContext);
}
