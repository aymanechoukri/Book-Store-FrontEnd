import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />

          <Route path="dashboard" element={<Dashboard />} >
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
