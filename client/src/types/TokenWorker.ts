interface ITokenWorkerGet {
  action: "GET";
}

interface ITokenWorkerPost {
  action: "POST";
  token: string;
}

interface ITokenWorkerToken {
  status: "ok";
  token: string;
}

interface ITokenWorkerError {
  status: "error";
  message: string;
}

type TokenWorker = ITokenWorkerGet | ITokenWorkerPost;
type TokenWorkerRes = ITokenWorkerToken | ITokenWorkerError;

export type { TokenWorkerRes, TokenWorker };
