export function sortByName<T>(array: T[], property: keyof T): T[] {
  return array.toSorted((a, b) => {
    if (!a[property]) return 1;
    if (!b[property]) return -1;

    const strA = (a[property] as string)
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');
    const strB = (b[property] as string)
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');

    return strA.localeCompare(strB);
  });
}
