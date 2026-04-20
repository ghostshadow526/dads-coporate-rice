import { useEffect, useState } from 'react';
import { FirebaseUser, db, collection, getDocs, updateDoc, doc, auth } from '../firebase';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Users, ShieldCheck, LogOut } from 'lucide-react';

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
  }, []);

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Manage users and upgrade access</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>{currentUser.email}</span>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700">Users Management</h2>
              <span className="text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{user.displayName || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isUpgraded ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Upgraded
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={updatingId === user.uid}
                          onClick={() => toggleUpgrade(user)}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold shadow-sm border transition-all ${
                            user.isUpgraded
                              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              : 'bg-green-600 text-white border-green-600 hover:bg-green-700'
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
                      <td className="px-6 py-8 text-center text-sm text-gray-500" colSpan={5}>
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
    </div>
  );
}
