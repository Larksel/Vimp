export interface IBaseModule {
  init?: () => Promise<void>;
}