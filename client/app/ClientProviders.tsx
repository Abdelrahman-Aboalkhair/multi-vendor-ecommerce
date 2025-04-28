"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";
import Toast from "./components/feedback/Toast";
import AuthGate from "./AuthGate";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <AuthGate>{children}</AuthGate>
        <Toast />
      </ApolloProvider>
    </Provider>
  );
}
