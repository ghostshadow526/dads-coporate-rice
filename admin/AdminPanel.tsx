import { useEffect, useState } from 'react';
import { FirebaseUser, db, collection, getDocs, updateDoc, doc } from './firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Users, ShieldCheck } from 'lucide-react';

interface AdminUserProfile {
  uid: string;
  displayName: string | null;
  email: string;
  role?: 'user' | 'admin';
  isUpgraded?: boolean;
}

interface AdminProps {
  currentUser: FirebaseUser;
  profile: AdminUserProfile | null;
}

export default function AdminPanel({ currentUser, profile }: AdminProps) {
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const data: AdminUserProfile[] = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
        setUsers(data);
      } catch (error: any) {
        console.error('Failed to load users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [profile]);

  const toggleUpgrade = async (user: AdminUserProfile) => {
    try {
      setUpdatingId(user.uid);
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, { isUpgraded: !user.isUpgraded });
      setUsers((prev) => prev.map((u) => (u.uid === user.uid ? { ...u, isUpgraded: !u.isUpgraded } : u)));
      toast.success(`User ${user.email} ${user.isUpgraded ? 'set to pending' : 'upgraded'} successfully`);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!profile || profile.role !== 'admin') {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 font-medium">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage users and upgrade their access.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Signed in as admin: {currentUser.email}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Users</h2>
            <span className="text-xs text-gray-500">{users.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Upgraded</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">{user.displayName || '-'} </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 text-xs">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[11px] font-semibold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs">
                      {user.isUpgraded ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                          Upgraded
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={updatingId === user.uid}
                        onClick={() => toggleUpgrade(user)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-colors ${
                          user.isUpgraded
                            ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            : 'bg-green-600 text-white border-transparent hover:bg-green-700'
                        } ${updatingId === user.uid ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {updatingId === user.uid
                          ? 'Saving...'
                          : user.isUpgraded
                          ? 'Set as Pending'
                          : 'Mark as Upgraded'}
                      </motion.button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-sm text-gray-500" colSpan={5}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
