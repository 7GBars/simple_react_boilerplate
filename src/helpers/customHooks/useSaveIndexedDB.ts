import {IndexedDBHelper} from "../IndexedDB";
import {useRef, SetStateAction, useEffect, Dispatch} from "react";

import {TBookType} from "../../pages/index";


export  const useSaveIndexedDB = <N extends string, D>(
  dbName: N,
  objectModel: D,
  setDefaultDataCallBack:  Dispatch<SetStateAction<D>>
): IndexedDBHelper<D, 'files' | 'objects'>  => {
  const dbHelper = new IndexedDBHelper<D, 'files' | 'objects'>(dbName, ['objects', 'files']);

  const savedObjectRef = useRef<D>(null);
  savedObjectRef.current = objectModel;

  useEffect(() => {
    dbHelper.connectDB().then((res) => {
      dbHelper.getDataByKey('files')
        .then(data => {
            console.log('data on Set', data);
            data && setDefaultDataCallBack(data);
        })
    })

    return () => {
      console.log('component book unmounted')
      if (dbHelper.DataBase) {
        console.log('connect при размонтировании остался',  objectModel)
        dbHelper.saveObjectData('files', savedObjectRef.current);
      } else {
        console.log('Новый коннект при размонтировании',  savedObjectRef.current)
        dbHelper.connectDB().then((res) => {
          dbHelper.saveObjectData('files', savedObjectRef.current)
        })
      }
    }
  }, []);

  return dbHelper;
}