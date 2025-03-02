import useAppRoutes from './hooks/useAppRoutes'

function App() {
  const appRoutes = useAppRoutes()
  return <>{appRoutes}</>
}

export default App
