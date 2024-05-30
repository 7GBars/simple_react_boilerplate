import React, {FC, useState} from 'react';

import {SAVED_FILE_FIELD} from "../constants/index";
import {FileLoader} from "../components/index";

import './main.scss';

import {IndexedDBHelper} from "../utils/useIndexedDB/IndexedDB";

type TMainProps = {

};
export const Main: FC<TMainProps> = props => {
  const [id, setId] = useState(0)
  const [savedFile, setSavedFile] = useState(undefined);
  const dbName ='my-db'
  let book = {
    id: 'react',
    price: 10,
    created: new Date()
  };
  const dbHelper = new IndexedDBHelper(dbName, ['fileStore', 'objectStore']);

  return (
    <>
      <button onClick={() => {
        dbHelper.connectDB();
      }}> Добавить
      </button>
      <button onClick={() => {
        dbHelper.deleteDB(dbName);
      }}> Удалить bd
      </button>
    </>
  );
};


