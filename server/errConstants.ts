enum ClientErrorNames {
    "UNAUTHORIZED",
    "VALIDATION_ERROR",
    "USER_ALREADY_EXISTS"
}

type ClientErrorName = keyof typeof ClientErrorNames

const errorTypes = {
    "UNAUTHORIZED": {
        statusCode: "401",
        message: "Authorize to access"
    }, 
    "VALIDATION_ERROR": {
        statusCode: "400",
        message: "Wrong parameters"
    },
    "USER_ALREADY_EXISTS": {
        statusCode: "403",
        message: "User already exists"
    }
} 

function ClientError (error: ClientErrorName): Error
function ClientError (error: ClientErrorName, message: string): Error
function ClientError (error: ClientErrorName, message?: string): Error {
    if (message !== undefined) {
        return new Error(JSON.stringify({
            error, 
            message
        }))
    } else {
        return new Error(error)
    }
}

export { ClientError }
