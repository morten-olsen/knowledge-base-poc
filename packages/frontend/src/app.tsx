import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { StoreProvider } from './features/store/store.provider'
import { useRef } from 'react'
import { Interface } from './containers/interface/interface';

const App = () => {
  const queryClient = useRef(new QueryClient());
  return (
    <QueryClientProvider client={queryClient.current}>
      <StoreProvider>
        <Interface />
      </StoreProvider>
    </QueryClientProvider>
  )
}

export { App }
