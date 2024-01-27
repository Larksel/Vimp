export const formatDate = (date: Date) => {
  const offsetMinutos = date.getTimezoneOffset();
  const milissegundos = offsetMinutos * 60 * 1000;
  const data = new Date(date.getTime() - milissegundos);


  return data.toISOString();
};
