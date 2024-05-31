import { v4 as uuidv4 } from 'uuid';

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
  public async connectDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open(this._dbName, 1);
      openRequest.onupgradeneeded = (e) => {
        console.log('onupgradeneeded');
        let db = (e.currentTarget as IDBOpenDBRequest).result;
        this._storesNames.map(name => {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: `id` });
          }
        })

      };
      openRequest.onsuccess = () => {
        console.log('onSuccess');
        let db = (openRequest.result as IDBDatabase);
        this._db = db;
        resolve();
      };
      openRequest.onerror = (err) => {
        console.error(`Ошибка открытия баззы ${this._dbName}`, openRequest.error);
        reject();
      };
    })
  }

  public async deleteDB(dbName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let deleteRequest = indexedDB.deleteDatabase(dbName);
      deleteRequest.onsuccess = (e) => {
        console.log(`База ${dbName} успешно удалена`, e)
        resolve()
      }
      deleteRequest.onerror = (err) => {
        console.error(`Ошибка удаления ${dbName}`, err);
        reject(err);
      }
    })
  }

  public async saveObjectData<N>(storeName: StoreNames, data: T): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        console.error('База данных не инициализирована');
        return;
      }
      const transaction = this._db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({...data, id: storeName});

      request.onsuccess = () => {
        console.log('Данные добавлены', 'id равен', request.result);
        resolve(request.result)
      };
      request.onerror = () => {
        console.log('Ошибка при добавлении данных', request.error);
        reject(request.error);
      };
    })

  }

  public async getDataByKey(key: StoreNames): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        console.error('База данных не инициализирована');
        return;
      }
      const transaction = this._db.transaction([key], 'readonly');
      const store = transaction.objectStore(key);
      const request = store.get(key);
      request.onsuccess = () => {
        console.log('Найденные данные:', request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Ошибка при поиске данных', request.error);
        reject(request.error);
      };
    })
  }


}