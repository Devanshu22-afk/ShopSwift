"use client";
import { Provider } from "react-redux";
import { AuthProvider } from "@/context/AuthContext";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>{children}</AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
