import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { DetalheEmpresa } from "./pages/DetalheEmpresa";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresa/:id" element={<DetalheEmpresa />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
