import { Outlet, useNavigate } from "react-router-dom";
import { SideBar } from "../Components/SideBar";
import TopBar from "../Components/TopBar";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");
    const token = Cookies.get("token");

    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="flex ">
      <SideBar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}