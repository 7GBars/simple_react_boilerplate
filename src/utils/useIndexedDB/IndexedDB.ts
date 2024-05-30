let openRequest = indexedDB.open("store", 1);


export class IndexedDBHelper<T, StoreNames extends string> {
  private readonly _dbName: string;
  private _storesNames: [StoreNames, StoreNames];
  private _db: IDBDatabase | null = null;

  public get DataBase() {
    return this._db;
  }
  constructor(dbName: string, storesNames: [StoreNames, StoreNames]) {
    this._dbName = dbName;
    const uniqueStores = new Set(storesNames);
    if (uniqueStores.size !== storesNames.length) {
      throw new Error("Имена хранилищ должны быть уникальными");
    }
    this._storesNames = storesNames;
  }
  public connectDB() {
    let openRequest = indexedDB.open(this._dbName, 1);

    openRequest.onupgradeneeded = (e) => {
      console.log('onupgradeneeded');
      let db = (e.currentTarget as IDBOpenDBRequest).result;
      this._storesNames.map(name => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'id' });
        }
      })

    };
    openRequest.onsuccess = () => {
     console.log('onSuccess');
     let db = (openRequest.result as IDBDatabase);
     this._db = db;
    };
    openRequest.onerror = (err) => {
      console.error(`Ошибка открытия баззы ${this._dbName}`, openRequest.error);
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

  public saveObjectData<N>(storeName: StoreNames, data: T ) {
    if (!this._db) {

      console.error('База данных не инициализирована');
      return;
    }
    const transaction = this._db.transaction([storeName], 'readwrite');
  }
  public saveFiles(storeName: StoreNames, data: T) {
    if (!this._db) {
      // reject('База данных не инициализирована');
      console.error('База данных не инициализирована');
      return;
    }
    const transaction = this._db.transaction([storeName], 'readwrite');
  }

}