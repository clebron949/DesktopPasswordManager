import { app } from "electron";

export function getAppVersion() {
  return app.getVersion();
}
