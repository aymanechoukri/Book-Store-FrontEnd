import { Link, useLocation } from "react-router-dom";

export function SideBar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "fa-solid fa-gauge" },
    { name: "Books", path: "/books", icon: "fa-book" },
    { name: "Add Book", path: "/add-book", icon: "fa-plus" },
    { name: "Users", path: "/dashboard/users", icon: "fa-users" },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-md p-5 hidden md:flex flex-col">
      
      {/* Links */}
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <i className={`fa-solid ${link.icon}`}></i>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Bottom (optional) */}
      <div className="mt-auto">
        <p className="text-xs text-gray-400">© 2026 Dashboard</p>
      </div>
    </aside>
  );
}