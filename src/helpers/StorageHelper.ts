import {TBookType} from "../pages";


export type TStoriesName = 'book'

export default class StorageHelper {
  private static readonly storage = window.localStorage;

  static get<T>(name: TStoriesName): T {
    const data = this.storage.getItem(name);
    return data ? JSON.parse(data) : null;
  }

  static set(
    name: TStoriesName,
    data: TBookType
  ) {
    if (data === undefined) return;
    this.storage.setItem(name, JSON.stringify(data));
  }

  static remove(name: TStoriesName) {
    const retrievedObj = this.storage.getItem(name);
    if (!retrievedObj) { return; }
    this.storage.removeItem(name);
  }
}


