import React, { useState } from 'react';

interface ManagedInputProps {
  defaultValue: string;
  onChange: (newValue: string) => void;
  type: 'text' | 'number'
}

export const TextInput: React.FC<ManagedInputProps> = ({
                                                     defaultValue,
                                                     onChange,
                                                   }) => {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};

