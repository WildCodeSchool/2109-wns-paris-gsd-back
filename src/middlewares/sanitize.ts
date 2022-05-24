import { MiddlewareFn } from "type-graphql";
import { Request, Response } from 'express';
import sanitize from "sanitize-html";

export interface MyContext {
  req: Request;
  res: Response;
}

export const SanitizeBody: MiddlewareFn<MyContext> = async ({context}, next) => {
    
    if (context.req.body.variables.data) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(context.req.body.variables.data)) {
            context.req.body.variables.data[key] = sanitize(context.req.body.variables.data[key])            
        }
    }
    
    return next();
  };
