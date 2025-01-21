// // src/components/common/PlatformSwitcher.jsx
// import React, { useState, useEffect } from 'react';
// import { Instagram, Youtube } from 'lucide-react';
// import * as instagramService from '../../services/instagram.service';
// import * as youtubeService from '../../services/youtube.service';

// const PlatformSwitcher = ({ currentPlatform, onPlatformChange }) => {
//   const [platformStatus, setPlatformStatus] = useState({
//     instagram: false,
//     youtube: false
//   });

//   useEffect(() => {
//     checkPlatformConnections();
//   }, []);

//   const checkPlatformConnections = async () => {
//     try {
//       // Check Instagram connection
//       const instagramProfile = await instagramService.getInstagramProfile();
      
//       // Check YouTube connection
//       const youtubeProfile = await youtubeService.getYouTubeProfile();

//       setPlatformStatus({
//         instagram: !!instagramProfile,
//         youtube: youtubeProfile?.connected || false
//       });
//     } catch (error) {
//       console.error('Error checking platform connections:', error);
//     }
//   };

//   return (
//     <div className="flex items-center space-x-1 bg-white rounded-lg p-2">
//       {/* Instagram Radio */}
//       <label className={`flex items-center space-x-2 cursor-pointer ${
//         currentPlatform === 'instagram' ? 'text-pink-600' : 'text-gray-400'
//       }`}>
//         <input
//           type="radio"
//           name="platform"
//           value="instagram"
//           checked={currentPlatform === 'instagram'}
//           onChange={() => onPlatformChange('instagram')}
//           className="hidden"
//         />
//         <div className="relative">
//           <Instagram className="w-6 h-6" />
//           <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
//             platformStatus.instagram ? 'bg-green-400' : 'bg-gray-300'
//           }`} />
//         </div>
//         <span className="font-medium">Instagram</span>
//       </label>

//       {/* YouTube Radio */}
//       <label className={`flex items-center space-x-2 cursor-pointer ${
//         currentPlatform === 'youtube' ? 'text-red-600' : 'text-gray-400'
//       }`}>
//         <input
//           type="radio"
//           name="platform"
//           value="youtube"
//           checked={currentPlatform === 'youtube'}
//           onChange={() => onPlatformChange('youtube')}
//           className="hidden"
//         />
//         <div className="relative">
//           <Youtube className="w-6 h-6" />
//           <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
//             platformStatus.youtube ? 'bg-green-400' : 'bg-gray-300'
//           }`} />
//         </div>
//         <span className="font-medium">YouTube</span>
//       </label>
//     </div>
//   );
// };

// export default PlatformSwitcher;

//src/components/common/PlatformSwitcher.jsx
import React from 'react';
import { Instagram, Youtube } from 'lucide-react';
import * as instagramService from '../../services/instagram.service';

const PlatformSwitcher = ({ currentPlatform, onPlatformChange }) => {
  const handlePlatformChange = (platform) => {
    if (platform === 'youtube') {
      // Always switch back to Instagram when YouTube is clicked
      onPlatformChange('instagram');
    } else {
      onPlatformChange(platform);
    }
  };

  return (
    <div className="flex items-center space-x-1 bg-white rounded-lg p-2">
      {/* Instagram Radio */}
      <label className={`flex items-center space-x-1 cursor-pointer ml-[-15px] ${
        currentPlatform === 'instagram' ? 'text-pink-600' : 'text-gray-400'
      }`}>
        <input
          type="radio"
          name="platform"
          value="instagram"
          checked={currentPlatform === 'instagram'}
          onChange={() => handlePlatformChange('instagram')}
          className="hidden"
        />
        <div className="relative">
          <Instagram className="w-6 h-6 text-xs" />
          <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
            currentPlatform === 'instagram' ? 'bg-green-400' : 'bg-gray-300'
          }`} />
        </div>
        <span className="font-medium">Instagram</span>
      </label>

      {/* YouTube Radio */}
      <label className="flex items-center space-x-1 cursor-not-allowed opacity-60">
        <input
          type="radio"
          name="platform"
          value="youtube"
          disabled
          className="hidden"
        />
        <div className="relative">
          <Youtube className="w-6 h-6 text-gray-400" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300" />
        </div>
        <div className="flex items-center">
          <span className="font-medium text-gray-400">In progress</span>
          {/* <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Soon
          </span> */}
        </div>
      </label>
    </div>
  );
};

export default PlatformSwitcher;