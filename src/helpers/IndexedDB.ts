export class IndexedDBHelper<N, T, StoreNames extends string> {
  private readonly _dbName: N;
  private _storesNames: [StoreNames, StoreNames];
  private _db: IDBDatabase | null = null;
  private _savedFiles: File | undefined;

  private _isNeedSaveData: boolean = true;
  public get IsNeedSave() {
    return this._isNeedSaveData;
  }

  public get getFiles() {
    return this._savedFiles;
  }
  public get DataBase() {
    return this._db;
  }
  constructor(dbName: N, storesNames: [StoreNames, StoreNames]) {
    console.log('конструктор')
    this._dbName = dbName;
    const uniqueStores = new Set(storesNames);
    if (uniqueStores.size !== storesNames.length) {
      throw new Error("Имена хранилищ должны быть уникальными");
    }
    this._storesNames = storesNames;
  }

  #getCurrentDbVersion(dbName: string) {
    const version = localStorage.getItem(`dbVersion_${dbName}`);
    return version ? parseInt(version, 10) : 1;
  }
  private onVersionChange(version: number) {
    if (this._db) {
      this._db.close();
      const newVersion = this._db?.version + 1;
      localStorage.setItem(`dbVersion_${this._db?.name}`, newVersion.toString());
      console.log('version was up - new version is', newVersion);
      return newVersion;
    }
  }

  /**  работа с БД **/
  public async connectDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const currentDBVersion = this.#getCurrentDbVersion(this._dbName as string);

      let openRequest = indexedDB.open(this._dbName as string, currentDBVersion);
      openRequest.onupgradeneeded = (e) => {
        /** данное метод отрабатывает только при первой инициализации db **/
        let db = (e.currentTarget as IDBOpenDBRequest).result;
        this._storesNames.map(name => {
          db.createObjectStore(name, { keyPath: `id` });
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
  public async disconnectDB(): Promise<void> {
    if (this._db) {
      this._db.close();
      this._db = null;
      console.log('Соединение с базой данных закрыто - instance очищен');
    }
  }
  public async deleteDB(dbName: N): Promise<void> {
    await this.disconnectDB();
    return new Promise((resolve, reject) => {
      let deleteRequest = indexedDB.deleteDatabase(dbName as string);
      deleteRequest.onsuccess = (e) => {
        console.log(`База ${dbName} успешно удалена`, e)
        resolve()
      }
      deleteRequest.onerror = (err) => {
        console.error(`Ошибка удаления ${dbName}`, err);
        reject(err);
      }
      deleteRequest.onblocked = () => {
        console.warn(`Удаление базы данных ${dbName} заблокировано, так как другие соединения все еще открыты.`);
        reject('Удаление заблокировано');
      };
    })
  }

  /**  работа с хранилищами **/
  public async clearStore(storeName: StoreNames): Promise<void> {
    this._isNeedSaveData = false;
    return new Promise((resolve, reject) => {
      if (!this._db) {
        console.error('База данных не инициализирована');
        reject('База данных не инициализирована');
      } else {
        const transaction = this._db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const clearRequest = store.clear();

        clearRequest.onsuccess = () => {
          console.log(`Все данные из хранилища ${storeName} были удалены.`);
          this.disconnectDB()
          resolve();
        };

        clearRequest.onerror = () => {
          console.error('Ошибка при очистке хранилища', clearRequest.error);
          reject(clearRequest.error);
        };
      }
    });
  }
  public async deleteStore(storeName: StoreNames): Promise<void> {
    if (!this._db) {
      console.error('База данных не инициализирована');
      return Promise.reject('База данных не инициализирована');
    }
    return new Promise((resolve, reject) => {
      const newVersion = this.onVersionChange(this._db?.version!);
      const openRequest = indexedDB.open(this._dbName as string, newVersion);

      openRequest.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (db.objectStoreNames.contains(storeName)) {
          db.deleteObjectStore(storeName); // Удаление хранилища
          this._db = null;
          console.log(`Хранилище ${storeName} удалено`);
        }
      };
      openRequest.onsuccess = () => {
        this._db = openRequest.result;
        console.log(`База данных обновлена, хранилище ${storeName} удалено`);
        resolve();
      };
      openRequest.onerror = (err) => {
        console.log('onerror');
        console.error(`Ошибка при обновлении базы данных: ${openRequest.error}`);
        reject(err);
      };
      openRequest.onblocked = (e) => {
        console.log('Запрос на обновление базы данных заблокирован');
      };
    });
  }
  public async addStore(newStoreName: StoreNames): Promise<void> {
    if (!this._db) {
      console.error('База данных не инициализирована');
      return Promise.reject('База данных не инициализирована');
    }
    return new Promise((resolve, reject) => {
      const newVersion = this.onVersionChange(this._db?.version!);
      const openRequest = indexedDB.open(this._dbName as string, newVersion);

      openRequest.onupgradeneeded = (event) => {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains(newStoreName)) {
          db.createObjectStore(newStoreName, { keyPath: 'id' });
          console.log(`Хранилище ${newStoreName} успешно добавлено`);
        }
      };
      openRequest.onsuccess = () => {
        this._db = openRequest.result;
        resolve();
      };
      openRequest.onerror = (event) => {
        console.error(`Ошибка при добавлении хранилища ${newStoreName}:`, openRequest.error);
        reject(openRequest.error);
      };
      openRequest.onblocked = () => {
        console.warn(`Добавление хранилища ${newStoreName} заблокировано, так как другие соединения все еще открыты.`);
        reject('Добавление заблокировано');
      };
    });
  }

  /**  работа с данными **/
  public async saveObjectData(storeName: StoreNames, data: T | undefined): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        console.error('База данных не инициализирована');
        return;
      }
      const transaction = this._db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({
        ...data,
        id: storeName
      });
      request.onsuccess = () => {
        console.log('Данные добавлены', 'id записи в ', request.result);
        resolve(request.result)
      };
      request.onerror = () => {
        console.log('Ошибка при добавлении данных', request.error);
        reject(request.error);
      };
    })
  }

  public async addFilesToSave(storeName: StoreNames, fileData: File) {
    if (!this._db) {
      console.error('База данных не инициализирована');
      return;
    }
     return new Promise((resolve, reject) => {
       const transaction = this._db.transaction([storeName], 'readwrite');
       const store = transaction.objectStore(storeName);
       const fileWithKey = { id: Date.now().toString(), file: fileData };
       const request = store.put(fileWithKey);

       request.onsuccess = () => {
         console.log('Данные добавлены', 'id записи в ', request.result);
         resolve(request.result)
       };
       request.onerror = () => {
         console.log('Ошибка при добавлении данных', request.error);
         reject(request.error);
       };
     })
  }
  public async getStoreByKey(key: StoreNames): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      if (!this._db) {
        console.error('База данных не инициализирована');
        return;
      }
      const transaction = this._db.transaction([key], 'readonly');
      const store = transaction.objectStore(key);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        console.error('Ошибка при поиске данных', request.error);
        reject(request.error);
      };
    })
  }
}
