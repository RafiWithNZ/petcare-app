import "./App.css";
import Layout from "./layout/Layout";
import useIdleLogout from "./hooks/useIdleLogout";

function App() {
  useIdleLogout();
  return <Layout />;
}

export default App;
