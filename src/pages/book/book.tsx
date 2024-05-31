import React, {FC, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import StorageHelper from "../../helpers/StorageHelper";
import {TextInput} from "../../components/index";
import './book.scss'


type TBookProps = {};

export type TBookType = {
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
    <div className={'book-card'}>
      <div className={'book-card__info'}>
        <div className={'book__field'}>
          <label>
            Наименовани
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
            Цена
            <TextInput
              defaultValue={''}
              type={'number'}
              onChange={(value) => {
                setNewBookInfo({...newBookInfo, price: value})
              }}/>
          </label>
        </div>


      </div>
      <div className={'book-card__actions'}>
        <button onClick={(e) => {
          StorageHelper.set('book', newBookInfo);
          setNewBookInfo(initBookInfo);
        }}>Добавить книгу</button>
      </div>
    </div>

  );
}


