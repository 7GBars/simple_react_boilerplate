let openRequest = indexedDB.open("store", 1);



export class IndexedDBHelper<T> {
  dbName: string;
  private _db: IDBDatabase | null = null;

  constructor(dbName: string) {
    this.dbName = dbName;
    console.log('helper создан');
  }
  public connectDB(f?: (db:  IDBDatabase) => void) {
    let openRequest = indexedDB.open(this.dbName, 1);

    openRequest.onupgradeneeded = (e) => {
      console.log('onupgradeneeded');
      // let db = (e.currentTarget as IDBOpenDBRequest).result;
      // if (!db.objectStoreNames.contains('books')) {
      //   db.createObjectStore('books', {keyPath: 'id'});
      // }
    };

    openRequest.onsuccess = () => {
      // let db = (openRequest.result as IDBDatabase);
     console.log('onsuccess');
      // this.f(db);
      // this._db = db;

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