import React, {FC, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import StorageHelper from "../../helpers/StorageHelper";
import {TextInput} from "../../components/index";
import './book.scss'
import {makeLogger} from "ts-loader/dist/logger";
import {useEffect} from "react";
import {IndexedDBHelper} from "../../helpers/index";
import {useRef} from "react";


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
  const dbHelper = new IndexedDBHelper<TBookType, 'files' | 'objects'>('books', ['objects', 'files']);

  const bookData = useRef<TBookType>(null);
  bookData.current = newBookInfo;

  useEffect(() => {
    dbHelper.connectDB().then((res) => {
      dbHelper.getDataByKey('files')
        .then(data => console.log(data))
    })

    return () => {
      console.log('component book unmounted')
      if (dbHelper.DataBase) {
        console.log('connect при размонтировании остался',  newBookInfo)
        dbHelper.saveObjectData('files', bookData.current)
      } else {
        console.log('Новый коннект при размонтировании',  bookData.current)
        dbHelper.connectDB().then((res) => {
          dbHelper.saveObjectData('files', bookData.current)
        })
      }
    }
  }, []);

  console.log('rerender')
  return (
    <div className={'book-card'}>
      <div className={'book-card__info'}>
        <div className={'book__field'}>
          <label>
            Наименовани
            <TextInput
              value={newBookInfo.name}
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
              value={newBookInfo.price}
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


