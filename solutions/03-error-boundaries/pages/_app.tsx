import '../styles/globals.css';
import type { AppProps } from 'next/app';
import GlobalErrorBoundary from '../components/GlobalErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalErrorBoundary>
      <Component {...pageProps} />
    </GlobalErrorBoundary>
  );
}

export default MyApp;
