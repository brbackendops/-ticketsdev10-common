

export default class AuthError extends Error {
    statusCode = 401;

    constructor(message: string){
        super()
        this.message = message
    }


    serializeErrors(){
        return {
            status: "unauthorized",
            message: this.message
        }
    }
}