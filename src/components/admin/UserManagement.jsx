import { useEffect, useState } from "react";
import { User, Ban, CheckCircle } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import GlobalLoading from "../GlobalLoading";
import ConfirmDialog from "./ConfirmDialog";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        userId: null,
        isBanned: false,
        name: ""
    });
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const { data } = await api.get(
                "/api/admin/users",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    // Open modal
    const promptBan = (user) => {
        setModal({
            isOpen: true,
            userId: user._id,
            isBanned: user.isBanned,
            name: user.name
        });
    };

    // Actual action
    const executeBan = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            await api.put(
                `/api/admin/users/${modal.userId}/ban`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(modal.isBanned ? "User unbanned" : "User banned");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update user status");
        } finally {
            setModal({ ...modal, isOpen: false });
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === "active") return !user.isBanned;
        if (filter === "banned") return user.isBanned;
        return true;
    });

    if (loading) return <GlobalLoading isLoading={true} message="Loading Users..." />;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-1">User Management</h2>
                    <p className="text-muted-foreground">View and manage registered users</p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-neutral-200">
                    {["all", "active", "banned"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-neutral-50"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-neutral-200 bg-neutral-50">
                                <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase">User</th>
                                <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase">Role</th>
                                <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase">Status</th>
                                <th className="p-4 text-left text-xs font-semibold text-neutral-500 uppercase">Joined</th>
                                <th className="p-4 text-right text-xs font-semibold text-neutral-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.isBanned ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
                                                }`}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-neutral-900">{user.name}</p>
                                                <p className="text-xs text-neutral-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-600">Customer</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${user.isBanned
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                            }`}>
                                            {user.isBanned ? "Banned" : "Active"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => promptBan(user)}
                                            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ml-auto border ${user.isBanned
                                                ? "border-green-200 text-green-700 hover:bg-green-50"
                                                : "border-red-200 text-red-700 hover:bg-red-50"
                                                }`}
                                        >
                                            {user.isBanned ? (
                                                <><CheckCircle size={14} /> Unban</>
                                            ) : (
                                                <><Ban size={14} /> Ban User</>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-muted-foreground">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={executeBan}
                title={modal.isBanned ? "Unban User" : "Ban User"}
                message={modal.isBanned
                    ? `Are you sure you want to restore access for ${modal.name}? They will be able to login and make purchases again.`
                    : `Are you sure you want to ban ${modal.name}? They will no longer be able to login to their account.`
                }
                confirmText={modal.isBanned ? "Unban User" : "Ban User"}
                isDestructive={!modal.isBanned}
            />
        </div>
    );
}
