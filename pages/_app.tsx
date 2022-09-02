import { Toaster } from "react-hot-toast";
import NavBar from "../components/NavBar";
import { UserContext } from "../lib/context";
import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useUserData } from "../lib/hooks";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <NavBar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
