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

  const onValueChangeHandler = async (value: File) => {
    await dbHelperData.dbHelperInstance?.addFilesToSave('files', value);
  }

  const dbHelperData = useSaveIndexedDB<
    'books',
    TBookType
  >('books', initBookInfo, newBookInfo, confirmDialog);

  useEffect(() => {
    if (dbHelperData.dataFromDB.objectModel) {
      setNewBookInfo(dbHelperData.dataFromDB.objectModel);
    }
  }, [dbHelperData.dataFromDB.objectModel]);

  console.log('render book - file value: ', dbHelperData.dataFromDB.objectModel)
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
          await dbHelperData.dbHelperInstance?.saveObjectData('objects', newBookInfo);
        }}>Добавить книгу
        </button>
        <button onClick={async (e) => {
          await dbHelperData.dbHelperInstance?.clearStore('objects');
        }}>Удалить store книги
        </button>
      </div>
      <FileLoader savedImageFromBD={dbHelperData?.dataFromDB.files?.file} onValueChange={onValueChangeHandler}/>
      <button onClick={async (e) => {
        const files = await getAllDataFromStore(dbHelperData.dbHelperInstance?.DataBase, 'files');
        console.log('files', files);
      }}>Узнать данные хранилища файлов
      </button>
    </div>

  );
}


