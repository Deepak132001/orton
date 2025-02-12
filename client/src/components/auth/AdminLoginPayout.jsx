import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminPayoutDashboard = () => {
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const fetchPayoutRequests = async () => {
    try {
      const response = await api.get('/referral/admin/payouts');
      setPayoutRequests(response.data.users);
    } catch (err) {
      setError('Failed to fetch payout requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId, payoutId, newStatus) => {
    try {
      await api.post('/referral/admin/payout-status', {
        userId,
        payoutId,
        status: newStatus
      });
      
      // Refresh the list
      fetchPayoutRequests();
    } catch (err) {
      setError('Failed to update payout status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payout Requests</h1>
      
      <div className="space-y-6">
        {payoutRequests.map(user => (
          <div key={user._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-semibold">{user.email}</h2>
                <p className="text-sm text-gray-600">PayPal: {user.paypalEmail}</p>
              </div>
            </div>

            <div className="space-y-4">
              {user.payoutHistory
                .filter(payout => payout.status === 'pending')
                .map(payout => (
                  <div key={payout._id} className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">${payout.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                          Requested: {new Date(payout.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdateStatus(user._id, payout._id, 'processed')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(user._id, payout._id, 'failed')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {payoutRequests.length === 0 && (
          <div className="text-center text-gray-600">
            No pending payout requests
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayoutDashboard;