import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Users from "./Pages/Users";
import AddBooks from "./Pages/AddBooks";
import Books from "./Pages/Books";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import MyBooks from "./Pages/MyBooks";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-books" element={<MyBooks />} />
          <Route path="AllBooks" element={<Books />} />

          <Route path="dashboard" element={<Dashboard />} >
            <Route path="users" element={<Users />} />
            <Route path="add-books" element={<AddBooks />} />
            <Route path="books" element={<Books />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
