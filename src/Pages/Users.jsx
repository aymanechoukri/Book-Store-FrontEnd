import axios from "axios";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        console.log(res.data);
        setUsers(res.data.users);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    }

    getUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Users Dashboard
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                        {user.role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1">
                        <i className="fa-solid fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}