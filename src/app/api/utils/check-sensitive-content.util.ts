import { checkContentTemperature } from "./check-content-temperature.util";

export function checkSensitiveContent(text: string) {
  const contentTemperature = checkContentTemperature(text);
  if (contentTemperature == "blue") return false;

  return true;
}
