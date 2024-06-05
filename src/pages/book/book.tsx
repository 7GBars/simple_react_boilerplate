import React, {FC, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

import StorageHelper from "../../helpers/StorageHelper";
import {TextInput} from "../../components/index";
import './book.scss'
import {makeLogger} from "ts-loader/dist/logger";
import {useEffect} from "react";
import {IndexedDBHelper} from "../../helpers/index";
import {useRef} from "react";
import {useSaveIndexedDB} from "../../helpers/index";
import {FileLoader} from "../../components/index";
import {getAllDataFromStore} from "../../helpers/index";


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

  const confirmDialog = () => confirm('Достать данные')
  const [newBookInfo, setNewBookInfo] = useState<TBookType>(initBookInfo);


  const [fileData, setFileData] = useState<{id: string, file: File} | undefined>(undefined);
  const onValueChangeHandler = async (value: File) => {
    await dbHelper?.addFilesToSave('files', value);
  }

  const dbHelper = useSaveIndexedDB<
    'books',
    TBookType
  >('books', newBookInfo, setNewBookInfo, setFileData, confirmDialog);


  console.log('render book - file value: ', fileData)
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
        <button onClick={async (e) => {
          setNewBookInfo(initBookInfo);
          await dbHelper?.saveObjectData('objects', newBookInfo);
        }}>Добавить книгу
        </button>
        <button onClick={async (e) => {
          await dbHelper?.clearStore('objects');
        }}>Удалить store книги
        </button>
      </div>
      <FileLoader savedImageFromBD={fileData?.file} onValueChange={onValueChangeHandler}/>
      <button onClick={async (e) => {
        const files = await getAllDataFromStore(dbHelper?.DataBase, 'files');
        console.log('files', files);
      }}>Узнать данные хранилища файлов
      </button>
    </div>

  );
}


