import { ReactElement, useEffect } from 'react';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { useTranslation, appWithTranslation } from 'next-i18next';
import { getWebReqUrl } from '@fastgpt/web/common/system/utils';
import SystemStoreContextProvider from '@fastgpt/web/context/useSystem';

import NextHead from '@/components/common/NextHead';
import Layout from '@/components/Layout';
import QueryClientContext from '@/web/context/QueryClient';
import { useInitApp } from '@/web/context/useInitApp';
import ChakraUIContext from '@/web/context/ChakraUI';
import I18nContextProvider from '@/web/context/I18n';
import '@/web/styles/reset.scss';

type NextPageWithLayout = NextPage & {
  setLayout?: (page: ReactElement) => JSX.Element;
};
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const { feConfigs, scripts, title } = useInitApp();
  const { t } = useTranslation();
  // console.log('🌐 ~ App ~ Component, pageProps:', Component, pageProps);
  // console.log('🌐 ~ App ~ feConfigs, scripts, title:', feConfigs, scripts, title);

  // Forbid touch scale
  useEffect(() => {
    document.addEventListener(
      'wheel',
      function (e) {
        if (e.ctrlKey && Math.abs(e.deltaY) !== 0) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
  }, []);

  // * 定义 setLayout 函数，如果 Component 有自定义布局方法则使用，否则使用默认布局
  const setLayout = Component.setLayout || ((page) => <>{page}</>);

  return (
    <>
      <NextHead
        title={title}
        icon={getWebReqUrl(feConfigs?.favicon || process.env.SYSTEM_FAVICON)}
        desc={
          feConfigs?.systemDescription ||
          process.env.SYSTEM_DESCRIPTION ||
          `${title}${t('app:intro')}`
        }
      />
      {scripts?.map((item, i) => <Script key={i} strategy="lazyOnload" {...item}></Script>)}

      <QueryClientContext>
        <SystemStoreContextProvider device={pageProps.deviceSize}>
          <I18nContextProvider>
            <ChakraUIContext>
              <Layout>{setLayout(<Component {...pageProps} />)}</Layout>
            </ChakraUIContext>
          </I18nContextProvider>
        </SystemStoreContextProvider>
      </QueryClientContext>
    </>
  );
}

export default appWithTranslation(App);
