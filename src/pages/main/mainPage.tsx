import React, {FC, useState} from 'react';

import {SAVED_FILE_FIELD} from "../../constants/index";
import {FileLoader} from "../../components/index";

import '../main.scss';

import {IndexedDBHelper} from "../../helpers/IndexedDB";
import {useEffect} from "react";

type TMainProps = {

};
export const MainPage: FC<TMainProps> = props => {
  const [id, setId] = useState(0)
  const [savedFile, setSavedFile] = useState(undefined);
  const dbName ='my-db'
  let book = {
    id: 'react',
    price: 10,
    created: new Date()
  };
  const dbHelper = new IndexedDBHelper<'my-db', typeof book, 'fileStore' | 'objectStore'>(dbName, ['fileStore', 'objectStore']);

  useEffect(() => {
    dbHelper.connectDB();
  }, []);

  const [bookInfo, setInfo] = useState();
  return (
    <div style={{display: "flex", gap: 10}}>

      <button onClick={() => {
        dbHelper.saveObjectData('objectStore', book);
      }}> Добавить объект в базу данных объекта
      </button>

      <button onClick={() => {
        dbHelper.getDataFromStore('objectStore');
      }}> Получить данные
      </button>

      <button onClick={() => {
        dbHelper.deleteDB(dbName);
      }}> Удалить bd
      </button>
    </div>
  );
};


