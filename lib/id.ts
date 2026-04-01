import { randomInt } from "crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generatePublicId(length = 5) {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return result;
}
