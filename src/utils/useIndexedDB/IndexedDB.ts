let openRequest = indexedDB.open("store", 1);



export class IndexedDBHelper<T> {
  dbName: string;
  storesNames: [string, string];
  private _db: IDBDatabase | null = null;

  constructor(dbName: string, storesNames: [string, string]) {
    this.dbName = dbName;
    this.storesNames = storesNames;
  }
  public connectDB(f?: (db:  IDBDatabase) => void) {
    let openRequest = indexedDB.open(this.dbName, 1);

    openRequest.onupgradeneeded = (e) => {
      console.log('onupgradeneeded');
      let db = (e.currentTarget as IDBOpenDBRequest).result;
      this.storesNames.map(name => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      })

    };
    openRequest.onsuccess = () => {
     console.log('onSuccess');
     let db = (openRequest.result as IDBDatabase);
     this._db = db;
      f && f(db);
    };
    openRequest.onerror = (err) => {
      console.error(`Ошибка открытия баззы ${this.dbName}`, openRequest.error);
    };

  }

  public deleteDB(dbName: string) {
    let deleteRequest = indexedDB.deleteDatabase(dbName);
    deleteRequest.onsuccess = (e) => {
      console.log(`База ${dbName} успешно удалена`, e)
    }
    deleteRequest.onerror = (err) => {
      console.error(`Ошибка удаления ${dbName}`, err)
    }
  }

}