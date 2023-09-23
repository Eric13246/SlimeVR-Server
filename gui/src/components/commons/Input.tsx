import classNames from 'classnames';
import { forwardRef, MouseEvent, useMemo, useState } from 'react';
import {
  Control,
  Controller,
  FieldError,
  UseControllerProps,
} from 'react-hook-form';
import { EyeIcon } from './icon/EyeIcon';

interface InputProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  label?: string;
  name: string;
}

export const InputInside = forwardRef<
  HTMLInputElement,
  {
    variant?: 'primary' | 'secondary' | 'tertiary';
    label?: string;
    error?: FieldError;
    onChange: () => void;
  } & Partial<HTMLInputElement>
>(function AppInput(
  {
    type,
    placeholder,
    label,
    disabled,
    autocomplete,
    name,
    onChange,
    value,
    error,
    variant = 'primary',
  },
  ref
) {
  const [forceText, setForceText] = useState(false);

  const togglePassword = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setForceText(!forceText);
  };

  const classes = useMemo(() => {
    const variantsMap = {
      primary: classNames({
        'placeholder:text-background-30 bg-background-60 border-background-60':
          !disabled,
        'text-background-30 placeholder:text-background-30 border-background-70 bg-background-70':
          disabled,
      }),
      secondary: classNames({
        'placeholder:text-background-30 bg-background-50 border-background-50':
          !disabled,
        'text-background-40 placeholder:text-background-40 border-background-70 bg-background-70':
          disabled,
      }),
      tertiary: classNames({
        'placeholder:text-background-30 bg-background-40 border-background-40':
          !disabled,
        'text-background-30 placeholder:text-background-30 border-background-70 bg-background-70':
          disabled,
      }),
    };

    return classNames(
      variantsMap[variant],
      'w-full focus:ring-transparent focus:ring-offset-transparent min-h-[42px] z-10',
      'focus:outline-transparent rounded-md focus:border-accent-background-40',
      'text-standard relative transition-colors',
      error && 'border-status-critical border-1'
    );
  }, [variant, disabled, error]);

  const computedValue = disabled
    ? placeholder
    : value !== undefined
    ? value
    : '';

  return (
    <label className="flex flex-col gap-1">
      {label}
      <div className="relative w-full">
        <input
          type={forceText ? 'text' : type}
          className={classNames(classes, { 'pr-10': type === 'password' })}
          placeholder={placeholder || undefined}
          autoComplete={autocomplete ? 'off' : 'on'}
          onChange={onChange}
          name={name}
          value={computedValue} // Do we want that behaviour ?
          disabled={disabled}
          ref={ref}
        ></input>
        {type === 'password' && (
          <div
            className="fill-background-10 absolute top-0 h-full flex flex-col justify-center right-0 p-4"
            onClick={togglePassword}
          >
            <EyeIcon></EyeIcon>
          </div>
        )}
        {error?.message && (
          <div className="absolute top-[38px] z-0 pt-1.5 bg-background-70 px-1 w-full rounded-b-md text-status-critical">
            {error.message}
          </div>
        )}
      </div>
    </label>
  );
});

export const Input = ({
  type,
  control,
  name,
  placeholder,
  label,
  autocomplete,
  disabled,
  variant = 'primary',
  rules,
}: {
  rules?: UseControllerProps<any>['rules'];
  control: Control<any>;
} & InputProps &
  Partial<HTMLInputElement>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, value, ref, name },
        fieldState: { error },
      }) => (
        <InputInside
          type={type}
          autocomplete={autocomplete}
          label={label}
          placeholder={placeholder}
          variant={variant}
          value={value}
          disabled={disabled}
          error={error}
          onChange={onChange}
          ref={ref}
          name={name}
        ></InputInside>
      )}
    />
  );
};
