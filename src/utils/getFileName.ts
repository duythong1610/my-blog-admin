export const getFileName = (url: string) => {
  if (!url) return;
  const stringArr = url.split("/");
  return stringArr[stringArr.length - 1];
};
