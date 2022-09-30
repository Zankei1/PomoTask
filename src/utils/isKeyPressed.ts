import { KeyboardEvent } from "react";

export function isKeyPressed(
  key: string,
  event: KeyboardEvent<HTMLInputElement>
) {
  return event.key === key;
}
