import { IBaseWindowModule } from '@interfaces/modules/IBaseWindowModule';
import { GenericModel } from '@shared/types/vimp';

export interface IGenericDatabase<T> extends IBaseWindowModule {
  insertMany(
    items: T[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  updateMany(
    items: GenericModel<T>[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  deleteMany(
    items: GenericModel<T>[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  getAll(): Promise<GenericModel<T>[]>;
  getById(itemID: string): Promise<GenericModel<T>>;
  update(item: GenericModel<T>): Promise<PouchDB.Core.Response>;
  delete(itemID: string): Promise<void>;
  clear(): Promise<void>;
}
