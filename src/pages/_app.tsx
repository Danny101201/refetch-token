import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppType } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { api } from '~/utils/trpc';

import '~/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from '~/client/components/Provider';

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
};
export default api.withTRPC(MyApp);