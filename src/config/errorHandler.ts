import { Injectable } from "@angular/core";

@Injectable()
export class ErrorHandler implements ErrorHandler {
    handleError(error: Error) {
        console.error(error);
        throw error;
    }
}