import React, { useState } from 'react';

interface ManagedInputProps {
  value: string;
  onChange: (newValue: string) => void;
  type: 'text' | 'number'
}

export const TextInput: React.FC<ManagedInputProps> = ({
                                                     value,
                                                     onChange,
                                                   }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return <input type="text" value={value} onChange={handleChange} />;
};

