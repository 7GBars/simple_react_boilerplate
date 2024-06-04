import {IndexedDBHelper} from "..";
import {useRef, SetStateAction, useEffect, Dispatch} from "react";


export  const useSaveIndexedDB = <N extends string, D>(
  dbName: N,
  objectModel: D,
  setDefaultDataCallBack:  Dispatch<SetStateAction<D>>,
  confirmLogic: (...arg: any[]) => boolean,
): IndexedDBHelper<N, D, 'files' | 'objects'> | undefined => {
  const dbHelperInstanceRef = useRef<IndexedDBHelper<N, D, 'files' | 'objects'> | undefined>(undefined);
  const savedObjectRef = useRef<D>(objectModel);
  savedObjectRef.current = objectModel;

  useEffect(() => {
    dbHelperInstanceRef.current = new IndexedDBHelper<N, D, 'files' | 'objects'>(dbName, ['objects', 'files']);

    dbHelperInstanceRef.current!.connectDB().then((res) => {
      dbHelperInstanceRef.current!.getDataByKey('objects')
        .then(data => {
          if (data) {
            confirmLogic()
              ? setDefaultDataCallBack(data)
              : dbHelperInstanceRef.current?.clearStore('objects')
          }
        })
    })

    return () => {
      if (dbHelperInstanceRef.current!.DataBase) {
        dbHelperInstanceRef.current?.IsNeedSave && dbHelperInstanceRef.current!.saveObjectData('objects', savedObjectRef.current);
      }
      dbHelperInstanceRef.current!.disconnectDB();
    }
  }, []);

  return dbHelperInstanceRef.current;
}
