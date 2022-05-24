import { MiddlewareFn } from "type-graphql";
import { Request, Response } from 'express';

export interface MyContext {
  req: Request;
  res: Response;
}

// const SanitizeMw: MiddlewareFn = ({ args }, next) => {
    
//     console.log(args);

//     return next();
//   };
//   export default SanitizeMw;

  export const ResolveTime: MiddlewareFn<MyContext> = async ({root, args, info, context}, next) => {
    console.log(context.req.body.variables);
    if (context.req.body.variables) {
        // todo sanitize

    }
    
    
    return next();
    // const start = Date.now();
    // await next();
    // const resolveTime = Date.now() - start;
    // console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
  };
