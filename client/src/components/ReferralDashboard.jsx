import { useState, useEffect } from "react";
import {
  Copy,
  DollarSign,
  Users,
  CheckCircle,
  Share2,
  Gift,
  Instagram,
  X,
} from "lucide-react";
import api from "../services/api";

// Payout
const PayoutModal = ({
  isOpen,
  onClose,
  availableBalance,
  paypalEmail: existingPaypalEmail,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [paypalEmail, setPaypalEmail] = useState(existingPaypalEmail || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("/referral/payout", {
        amount: parseFloat(amount),
        paypalEmail,
      });

      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request payout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Request Payout</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total
            </label>
            <div className="text-2xl font-bold text-green-600">
              ${availableBalance.toFixed(2)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Withdraw
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min. $2)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="2"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PayPal Email
            </label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="Enter your PayPal email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                     transition-colors disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Request Payout"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Finish payout

const ReferralDashboard = () => {
  const [stats, setStats] = useState({
    referralCode: "",
    earnings: 0,
    referralCount: 0,
    pendingPayout: 0,
    totalPaidOut: 0,
    payoutHistory: [],
    paypalEmail: "",
  });
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await api.get("/referral/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load referral stats");
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${stats.referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setShowCopyAnimation(true);
      setTimeout(() => {
        setCopied(false);
        setShowCopyAnimation(false);
      }, 2000);
    } catch (err) {
      setError("Failed to copy referral link");
    }
  };
  const availableBalance =
    stats.earnings - stats.pendingPayout - stats.totalPaidOut;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
          Invite Friends & Earn Rewards
        </h1>
        <p className="text-gray-600 text-base md:text-lg px-4">
          Share your referral link and earn $2 for every friend who joins!
        </p>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {/* Important Notice */}
      <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <h3 className="font-semibold text-yellow-800">
          Important Requirements
        </h3>
        <p className="text-yellow-700 mt-1">
          For referral rewards to be valid, referred users must connect their
          Instagram Business Account to Orton AI.
        </p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-base md:text-lg">
                Total Earnings
              </p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                ${stats.earnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg transform transition-all duration-300 hover:scale-105">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-base md:text-lg">
                Friends Referred
              </p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">
                {stats.referralCount}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <Share2 className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Share Your Link</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Copy your unique referral link and share it with friends
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <Instagram className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Connect Instagram</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Friends sign up and connect their Instagram Business Account
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-indigo-100 rounded-full mb-4">
              <Gift className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Earn Rewards</h3>
            <p className="text-gray-600 text-sm md:text-base">
              Get $2 for each friend who successfully connects
            </p>
          </div>
        </div>
      </div>
      {/* Referral Link Section */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">
          Your Referral Link
        </h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={`${window.location.origin}/register?ref=${stats.referralCode}`}
            className="flex-1 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base text-gray-700"
            readOnly
          />
          <button
            onClick={copyReferralLink}
            className={`flex items-center justify-center space-x-2 px-6 py-3 md:py-4 bg-indigo-600 text-white rounded-lg 
                      hover:bg-indigo-700 transition-all duration-300 transform w-full md:w-auto
                      ${showCopyAnimation ? "scale-105" : "hover:scale-105"}`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
        <div className="mt-6 space-y-3 md:space-y-4">
          <p className="text-gray-600 text-sm md:text-base flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>
              Share this link with friends who want to grow their Instagram
              presence
            </span>
          </p>
          <p className="text-gray-600 text-sm md:text-base flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>
              They must connect their Instagram Business Account to qualify
            </span>
          </p>
          <p className="text-gray-600 text-sm md:text-base flex items-start space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span>Track your earnings and referrals in real-time</span>
          </p>
        </div>
      </div>

      {/* Referrall */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-base md:text-lg">
              Available for Payout
            </p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              ${availableBalance.toFixed(2)}
            </p>
            {stats.pendingPayout > 0 && (
              <p className="text-sm text-gray-500">
                Pending payout: ${stats.pendingPayout.toFixed(2)}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Total paid out: ${stats.totalPaidOut.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={stats.earnings - (stats.pendingPayout || 0) < 2}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>
      </div>
      {stats.payoutHistory?.length > 0 && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Payout History</h2>
          <div className="space-y-4">
            {stats.payoutHistory.map((payout, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-4"
              >
                <div>
                  <p className="font-medium">${payout.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payout.requestDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    payout.status === "processed"
                      ? "bg-green-100 text-green-800"
                      : payout.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payout.status.charAt(0).toUpperCase() +
                    payout.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Add the PayoutModal */}
      <PayoutModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        availableBalance={stats.earnings - (stats.pendingPayout || 0)}
        paypalEmail={stats.paypalEmail}
        onSuccess={() => {
          fetchReferralStats(); // Refresh the stats after successful payout request
          setShowPayoutModal(false);
        }}
      />
    </div>
  );
};

export default ReferralDashboard;
