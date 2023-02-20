import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import ReactAsyncSelect from 'react-select/async';
interface AsyncSelectProps {
  control: Control<any, any>;
  fieldName: string;
  promiseOptions: (inputValue: string) => Promise<any[]>;
  error: boolean;
  required: boolean;
  isMulti?: boolean;
}
function AsyncSelect({
  control,
  fieldName,
  promiseOptions,
  error,
  required,
  isMulti = false,
}: AsyncSelectProps) {
  const defaultConfig = {
    // isSearchable: false,
    isClearable: false,
    className: 'react-select-container',
    classNamePrefix: 'react-select',
  };
  const errorSelectStyle = error
    ? {
        borderColor: 'red',
        color: 'red',
      }
    : {};
  return (
    <FormControl sx={{ width: '100%', m: '10px 0', position: 'relative' }}>
      <FormLabel
        sx={{
          position: 'absolute',
          top: -8,
          left: 10,
          zIndex: 2,
          fontSize: '10px',
          background: '#fff',
          paddingLeft: '2px',
          paddingRight: '6px',
          boxSizing: 'border-box',
          color: error ? 'red' : 'inherit',
        }}
        required
      >
        {fieldName}
      </FormLabel>
      <Controller
        name={fieldName}
        control={control}
        render={({ field: { onChange, value, name, ref, ...field } }) => (
          <ReactAsyncSelect
            required={required}
            cacheOptions
            defaultValue={value}
            placeholder={`Search ${fieldName} ...`}
            maxMenuHeight={130}
            isMulti={isMulti}
            // @ts-ignore - Conflict btw react-hook-form and react-select
            loadOptions={promiseOptions}
            onChange={(option: any) => {
              console.log('🚀 ~ option:', option);
              if (isMulti) onChange(option.map((o) => o.value));
              else onChange(option.value);
            }}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                ...errorSelectStyle,
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                ...errorSelectStyle,
              }),
            }}
            {...defaultConfig}
            {...field}
          />
        )}
      />
      <FormHelperText sx={{ m: '3px 14px 0' }} error={error}>
        {error && `${fieldName} is required`}
      </FormHelperText>
    </FormControl>
  );
}

export default AsyncSelect;
