import AppRouter from "./appRouter/appRouter";
import ApolloContextProvider from "./context/apolloContext";
import { AuthProvider } from "./context/authContext";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  document.addEventListener("DOMContentLoaded", () => {
    // This will wait for the window to load, but you could
    // run this function on whatever trigger you want
    invoke("close_splashscreen");
  });

  return (
    <ApolloContextProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ApolloContextProvider>
  );
}

export default App;
