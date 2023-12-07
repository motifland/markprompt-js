import '@markprompt/css';
import './global.css';

import { AppProps } from 'next/app';
import React, { ReactElement } from 'react';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return <Component {...pageProps} />;
}
