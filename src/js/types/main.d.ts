import { ElectronApi } from "./electronApiTypes";

declare global {
  interface Window {
    electron: ElectronApi;
  }

  interface WindowEventMap {
    "app-menu": Event;
  }
}
