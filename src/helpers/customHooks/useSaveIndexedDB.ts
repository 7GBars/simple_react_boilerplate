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

  if (!dbHelperInstanceRef.current) {
    dbHelperInstanceRef.current = new IndexedDBHelper<N, D, 'files' | 'objects'>(dbName, ['objects', 'files']);
  }
  useEffect(() => {
    console.log(dbHelperInstanceRef.current, 'что по факту') // тут все хорошо ъкземпляр IndexedDBHelper
    dbHelperInstanceRef.current!.connectDB().then((res) => {
      dbHelperInstanceRef.current!.getStoreByKey('objects')
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

  console.log(dbHelperInstanceRef.current, 'что на выходе') // тут undefined
  return dbHelperInstanceRef.current;
}
