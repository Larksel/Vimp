export const formatDate = (date: Date | undefined) => {
  if (date === undefined) return null;

  const dateObj = new Date(date);
  const offsetMinutos = dateObj.getTimezoneOffset();
  const milissegundos = offsetMinutos * 60 * 1000;
  const data = new Date(dateObj.getTime() - milissegundos);

  return data.toISOString();
};
