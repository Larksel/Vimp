interface CrudRepository {
  insert: (...args: never[]) => unknown;
  getById: (...args: never[]) => unknown;
  getAll: (...args: never[]) => unknown;
  update: (...args: never[]) => unknown;
  deleteById: (...args: never[]) => unknown;
}

interface CrudService<TRepository extends CrudRepository> {
  insert: (
    ...args: Parameters<TRepository['insert']>
  ) => ReturnType<TRepository['insert']>;
  getById: (
    ...args: Parameters<TRepository['getById']>
  ) => ReturnType<TRepository['getById']>;
  getAll: (
    ...args: Parameters<TRepository['getAll']>
  ) => ReturnType<TRepository['getAll']>;
  update: (
    ...args: Parameters<TRepository['update']>
  ) => ReturnType<TRepository['update']>;
  deleteById: (
    ...args: Parameters<TRepository['deleteById']>
  ) => ReturnType<TRepository['deleteById']>;
}

export function createCrudService<TRepository extends CrudRepository>(
  repository: TRepository,
): CrudService<TRepository> {
  return {
    insert: (...args: Parameters<TRepository['insert']>) =>
      repository.insert(...args) as ReturnType<TRepository['insert']>,
    getById: (...args: Parameters<TRepository['getById']>) =>
      repository.getById(...args) as ReturnType<TRepository['getById']>,
    getAll: (...args: Parameters<TRepository['getAll']>) =>
      repository.getAll(...args) as ReturnType<TRepository['getAll']>,
    update: (...args: Parameters<TRepository['update']>) =>
      repository.update(...args) as ReturnType<TRepository['update']>,
    deleteById: (...args: Parameters<TRepository['deleteById']>) =>
      repository.deleteById(...args) as ReturnType<TRepository['deleteById']>,
  };
}
