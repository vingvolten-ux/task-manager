import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import List from "./pages/List";
import Detail from "./pages/Detail";
import AddItem from "./pages/AddItem";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/list" element={<List />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/add" element={<AddItem />} />
    </Routes>
  );
}

export default App;