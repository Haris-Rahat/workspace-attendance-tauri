import AppRouter from "./appRouter/appRouter";
import ApolloContextProvider from "./context/apolloContext";
import { AuthProvider } from "./context/authContext";
import { invoke } from "@tauri-apps/api/tauri";

document.addEventListener("DOMContentLoaded", () => {
  // This will wait for the window to load, but you could
  // run this function on whatever trigger you want
  setTimeout(() => {
    invoke("close_splashscreen");
  }, 1000);
});

function App() {
  return (
    <ApolloContextProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ApolloContextProvider>
  );
}

export default App;
