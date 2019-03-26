// api/common.ts
// Jeremy Campbell
// Shared code for the api feature
export const defaultServerErrorMessage = "Oops! Something went wrong on our end";
export const defaultUserErrorMessage = "Incorrect data in request, try again";

enum MongooseErrorName {
    MongoError, 
    ValidatorError
} 

export interface MongooseError {
    name: MongooseErrorName
}