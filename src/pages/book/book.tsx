import React, {FC, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import {TextInput} from "../../components/index";


type TBookProps = {};

type TBookType = {
  id: string,
  name: string
  price: string,
  created: Date
}
export const Book: FC<TBookProps> = props => {
  const initBookInfo: TBookType = {
    id: uuidv4(),
    created: new Date(),
    name: '',
    price: ''
  };

  const [newBookInfo, setNewBookInfo] = useState<TBookType>(initBookInfo);

  return (
    <div className={'book'}>

      <div className={'book__field'}>
        <label>
          <TextInput
            defaultValue={newBookInfo.name}
            type={'text'}
            onChange={(value) => {
              setNewBookInfo({...newBookInfo, name: value})
            }}
          />
        </label>

      </div>
      <div className={'book__field'}>
        <label>
          <TextInput
            defaultValue={''}
            type={'number'}
            onChange={(value) => {
              setNewBookInfo({...newBookInfo, price: value})
            }}/>
        </label>

      </div>
    </div>
  );
}


