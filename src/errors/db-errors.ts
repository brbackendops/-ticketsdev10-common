
export class DatabaseError extends Error {
    constructor(message: string){
        super();
        this.message = message;
    }


    serializeErrors(){
        return {
            status: "error",
            message: this.message
        }
    }
}