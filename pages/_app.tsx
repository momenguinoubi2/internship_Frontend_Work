import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider } from "@apollo/client";
import client from './api/client';
import { AuthProvider } from './api/auth';
import { CookiesProvider } from 'react-cookie';
function MyApp({ Component, pageProps }:AppProps) {
  return (
    <AuthProvider>
      <CookiesProvider>
      <Component {...pageProps} />
     </CookiesProvider>
    </AuthProvider>
  );
}
export default MyApp
