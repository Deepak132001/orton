// client/src/components/dashboard/EngagementMetrics.jsx
import { Card } from '@/components/ui/card';

const EngagementMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Engagement Rate</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics?.engagementRate || '0'}%
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Average across all posts
        </p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Followers</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics?.followers?.toLocaleString() || '0'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Total followers
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Reach</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics?.reach?.toLocaleString() || '0'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Average post reach
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-500">Profile Visits</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {metrics?.profileVisits?.toLocaleString() || '0'}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Last 7 days
        </p>
      </Card>
    </div>
  );
};