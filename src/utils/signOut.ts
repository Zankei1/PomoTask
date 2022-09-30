import { destroyCookie } from "nookies";

export function signOut() {
  destroyCookie(undefined, "PomoTask.token");
  destroyCookie(undefined, "PomoTask.refreshToken");
}
