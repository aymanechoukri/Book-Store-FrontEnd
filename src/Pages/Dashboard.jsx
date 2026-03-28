import { Outlet } from "react-router-dom";
import { SideBar } from "../Components/SideBar";
import TopBar from "../Components/TopBar";

export default function Dashboard() {
  return (
    <div className="flex">
      
      {/* Sidebar */}
      <SideBar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col">
        
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="p-6 bg-gray-100 min-h-screen">
          <Outlet />
        </main>

      </div>
    </div>
  );
}