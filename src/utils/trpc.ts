import { AppRouter } from '../server/routers/app.routes';

import { httpBatchLink, httpLink, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { queryClient } from '~/client/components/Provider';
import { useStore } from '~/client/store';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const api = createTRPCNext<AppRouter>({
  overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn()
        await opts.queryClient.invalidateQueries()
      }
    }
  },

  config(opts) {
    return {
      transformer: superjson,
      links: [
        splitLink({
          condition(opts) {
            return opts.context.skipBatch === true
          },
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
            // You can pass any HTTP headers you wish here
            async headers() {
              const { access_token } = useStore.getState()
              return {
                authorization: access_token || ''
              };
            },
          }),
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
            // You can pass any HTTP headers you wish here
            async headers() {
              const { access_token } = useStore.getState()
              return {
                authorization: access_token || ''
              };
            },
          }),
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 5 * 1000
          }
        }
      },

    };
  },
  ssr: false,
});

