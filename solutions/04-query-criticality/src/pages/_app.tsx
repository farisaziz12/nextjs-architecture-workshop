import "@/styles/globals.css";
import { useState } from "react";
import type { AppProps } from "next/app";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

export default function App({ Component, pageProps }: AppProps) {
  // Having queryClient in state ensures that data is not shared between different users and requests, while still only creating the QueryClient once per component lifecycle.
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 2,
        },
      },
    });
  });

  const { dehydratedState, ...componentPageProps } = pageProps;
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <HydrationBoundary state={dehydratedState}>
        <MantineProvider>
          <Component {...componentPageProps} />
        </MantineProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}