export class ExistsError extends Error {
    
    statusCode: number = 409

    constructor(message: string){
        super();
        this.name = "ExistsError";
        this.message = message;
    }


    serializeError(){
        return {
            status: "error",
            message: this.message
        }
    }
}