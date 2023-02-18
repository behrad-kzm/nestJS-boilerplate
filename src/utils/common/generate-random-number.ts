export function generateRandomNumber(len: number) {
  const token =
    Math.floor(Math.random() * (9 * 10 ** (len - 1))) + 10 ** (len - 1);
  return `${token}`;
}