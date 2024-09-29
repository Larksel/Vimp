import { Track } from '@shared/types/vimp';
import { IBaseModule } from './IBaseModule';

export interface IMetadataModule extends IBaseModule {
  getMetadata(trackPath: string): Promise<Track>;
  getCover(trackPath: string): Promise<string | null>;
}
