// pages/_app.tsx
import '@/app/globals.css'; // ajuste o caminho conforme necessário
import type { AppProps } from 'next/app';

function GorkiAdmin({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default GorkiAdmin;
