export function removeSpecialCaracteresFromString(text: string = "") {
  const regex = /[^a-zA-Z0-9\s]/g;
  const stringWithoutSpecialCaracteres = text.replace(regex, "");

  return stringWithoutSpecialCaracteres;
}
