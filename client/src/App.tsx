import { Provider } from "react-redux";
import { store } from "./redux/app/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import AppRouter from "./router/AppRouter";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
          <AppRouter />
          <Toaster richColors position="bottom-right" />
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
