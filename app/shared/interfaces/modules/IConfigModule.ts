import { IBaseModule } from './IBaseModule';
import { Config } from '@shared/types/vimp';
import Store from 'electron-store';

export interface IConfigModule extends IBaseModule {
  getConfig(): Store<Config>;
}
