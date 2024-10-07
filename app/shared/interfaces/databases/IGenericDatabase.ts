import { GenericModel } from '@shared/types/vimp';

export interface IGenericDatabase<T> {
  insertMany(
    items: T[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  updateMany(items: GenericModel<T>[]): Promise<GenericModel<T>[]>;
  deleteMany(items: GenericModel<T>[]): Promise<GenericModel<T>[]>;
  getAll(): Promise<GenericModel<T>[]>;
  getById(itemID: string): Promise<GenericModel<T>>;
  update(item: GenericModel<T>): Promise<PouchDB.Core.Response>;
  delete(itemID: string): Promise<void>;
  clear(): Promise<void>;
}
