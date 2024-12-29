import { IBaseWindowModule } from '@interfaces/modules/IBaseWindowModule';
import { GenericModel } from '@shared/types/vimp';

export interface IGenericDatabase<T> extends IBaseWindowModule {
  getAll(): Promise<GenericModel<T>[]>;
  getById(itemID: string): Promise<GenericModel<T>>;
  create(
    items: T | T[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  update(
    items: GenericModel<T> | GenericModel<T>[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  delete(
    items: GenericModel<T> | GenericModel<T>[],
  ): Promise<(PouchDB.Core.Error | PouchDB.Core.Response)[]>;
  clear(): Promise<void>;
}
