import { MiddlewareFn } from "type-graphql";

const resolversLogger: MiddlewareFn = async (_, next) => {
  const res = await next();
  console.log(res);
  return res;
};

export default resolversLogger;
