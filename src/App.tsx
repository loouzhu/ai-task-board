import { RouterProvider } from "react-router-dom"
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import './App.less'
import router from "./routes"

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
