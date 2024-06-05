import {IndexedDBHelper} from "..";
import {useRef, SetStateAction, useEffect, Dispatch} from "react";
import {getAllDataFromStore} from "..";
import {useState} from "react";

type useSaveIndexedDBReturnType<N, D> = {
  dbHelperInstance: IndexedDBHelper<N, D, 'files' | 'objects'> | undefined,
  dataFromDB: {
    objectModel: D,
    files: {id: string, file: File} | undefined
  }
}
export  const useSaveIndexedDB = <N extends string, D>(
  dbName: N,
  initObjectModel: D,
  dataForSave: D,
  confirmLogic: (...arg: any[]) => boolean,
): useSaveIndexedDBReturnType<N, D> => {
  const [savedData, setSavedData] = useState<{
    objectModel: D,
    files: {id: string, file: File} | undefined
  }>({objectModel: initObjectModel, files: undefined})
  const dbHelperInstanceRef = useRef<IndexedDBHelper<N, D, 'files' | 'objects'> | undefined>(undefined);
  const savedObjectRef = useRef<D>(dataForSave);
  savedObjectRef.current = dataForSave;

  if (!dbHelperInstanceRef.current) {
    dbHelperInstanceRef.current = new IndexedDBHelper<N, D, 'files' | 'objects'>(dbName, ['objects', 'files']);
  }
  useEffect(() => {
    console.log(dbHelperInstanceRef.current, 'что по факту') // тут все хорошо ъкземпляр IndexedDBHelper
    dbHelperInstanceRef.current!.connectDB().then((res) => {
      dbHelperInstanceRef.current!.getStoreByKey('objects')
        .then(data => {
          if (data) {
           return confirmLogic() ? data : (
             dbHelperInstanceRef.current?.clearStore('objects'),
             dbHelperInstanceRef.current?.clearStore('files'),
             undefined
           );
          }
        })
        .then((objectModel) => {
          getAllDataFromStore(dbHelperInstanceRef.current?.DataBase, 'files')
            .then(files => {
              if (objectModel || files.length) {
                setSavedData({
                  objectModel: objectModel as unknown as D,
                  files: files[1]
                });
              }

            })
        })

    })

    return () => {
      if (dbHelperInstanceRef.current!.DataBase) {
        dbHelperInstanceRef.current?.IsNeedSave && dbHelperInstanceRef.current!.saveObjectData('objects', savedObjectRef.current);
      }
      dbHelperInstanceRef.current!.disconnectDB();
    }
  }, []);


  return {
    dbHelperInstance: dbHelperInstanceRef.current,
    dataFromDB: savedData
  };
}
