export const sortUtils = {
  sortByString: <T>(
    array: T[],
    property: keyof T,
    direction: 'asc' | 'desc' = 'asc',
  ): T[] => {
    const sortedArray = [...array];

    return sortedArray.toSorted((a, b) => {
      const valueA = a[property];
      const valueB = b[property];

      if (valueA == null || valueA === '') return 1;
      if (valueB == null || valueB === '') return -1;

      if (typeof valueA !== 'string' || typeof valueB !== 'string') return 0;

      const strA = valueA
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');
      const strB = valueB
        .normalize('NFKD')
        .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');

      return direction === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA);
    });
  },
  sortByDate: <T>(
    array: T[],
    property: keyof T,
    direction: 'asc' | 'desc' = 'asc',
  ): T[] => {
    const sortedArray = [...array];

    return sortedArray
      .filter((item) => item[property] !== undefined && item[property] !== null)
      .toSorted((a, b) => {
        const dateA = new Date(a[property] as string | Date).getTime();
        const dateB = new Date(b[property] as string | Date).getTime();

        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;

        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      });
  },
  sortByNumber: <T>(
    array: T[],
    property: keyof T,
    direction: 'asc' | 'desc' = 'desc',
    filterZeroOrNegative = false,
  ): T[] => {
    const sortedArray = [...array];

    return sortedArray
      .filter((item) => {
        const value = item[property];
        if (typeof value !== 'number') return false;
        return filterZeroOrNegative ? value > 0 : true;
      })
      .toSorted((a, b) => {
        const numA = a[property] as number;
        const numB = b[property] as number;

        return direction === 'asc' ? numA - numB : numB - numA;
      });
  },
};
