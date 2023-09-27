import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createContext } from '~/server/createContext';

import { appRouter } from '~/server/routers/app.routes';

export default createNextApiHandler({
  router: appRouter,
  createContext
});