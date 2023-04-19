import { TokenWorker, TokenWorkerRes } from "../types/TokenWorker";

// eslint-disable-next-line no-var
declare var self: DedicatedWorkerGlobalScope;

let token: string;

self.addEventListener("message", (e: MessageEvent<TokenWorker>) => {
  if (e.data.action === "POST") {
    token = e.data.token;
  } else {
    if (token !== undefined) {
      self.postMessage({ status: "ok", token } as TokenWorkerRes);
    } else {
      self.postMessage({
        status: "error",
        message: "No available token",
      } as TokenWorkerRes);
    }
  }
});
