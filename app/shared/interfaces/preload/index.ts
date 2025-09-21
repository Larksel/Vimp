import { IpcRenderer } from 'electron';
import { IGenericDatabase } from '../databases/IGenericDatabase';

export default interface GenericDatabaseIPCHandlers<T>
  extends IGenericDatabase<T> {
  onDBChanged(callback: () => void): IpcRenderer;
}
