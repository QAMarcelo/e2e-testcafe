export enum StringOptions {
    contains = 1,
    equal = 2,
  }

export const setPrefix = (text: string) => {
  const now = new Date();
  return `${now.getMonth()}${now.getDay()}${now.getFullYear().toString().substring(1, 3)}`;

}