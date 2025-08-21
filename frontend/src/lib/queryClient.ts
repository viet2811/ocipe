import { QueryClient } from "@tanstack/react-query";

// Persistence so data are saved and loaded instantly without seing the loading screen.
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      gcTime: 1000 * 60 * 60 * 24, //24 hours garbage collection(during session)
    },
  },
});

export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24 * 30, //30 days - same as refresh token
});
