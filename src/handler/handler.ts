import { FilterState } from "../filters/filter-interface";

/**
 * setNext() for building the chain of handlers.
 * handle() for executing a request.
 */
export interface Handler {
  setNext(handler: Handler): Handler;
  handle(request: FilterState, dirContent: string[]): Promise<string[]>;
}

export abstract class AbstractHandler implements Handler {
  private nextHandler!: Handler;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public async handle(request: FilterState, dirContent: string[]): Promise<string[]> {
    if (this.nextHandler) {
      return await this.nextHandler.handle(request, dirContent);
    }
    return dirContent;
  }
}
