enum ClientErrorNames {
  "UNAUTHORIZED",
  "VALIDATION_ERROR",
  "USER_ALREADY_EXISTS",
}

type ClientErrorName = keyof typeof ClientErrorNames;

export const constantErrorTypes = {
  UNAUTHORIZED: {
    statusCode: 401,
    message: "Authorize to access",
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    message: "Wrong parameters",
  },
  USER_ALREADY_EXISTS: {
    statusCode: 403,
    message: "User already exists",
  },
} 

type generalErrorType = {
  statusCode: typeof constantErrorTypes[ClientErrorName]["statusCode"];
  message: string;
};

function ClientError(error: ClientErrorName): Error;
function ClientError(error: ClientErrorName, message: string): Error;
function ClientError(error: ClientErrorName, message?: string): Error {
  if (message !== undefined) {
    return new Error(
      JSON.stringify({
        statusCode: constantErrorTypes[error].statusCode,
        message,
      })
    );
  } else {
    return new Error(JSON.stringify(constantErrorTypes[error]));
  }
}

export { ClientError, generalErrorType };
