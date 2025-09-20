
import { useState, useRef } from "react";

export const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Your demo video from Supabase storage
  const videoUrl = "https://nhmhqhhxlcmhufxxifbn.supabase.co/storage/v1/object/public/Videos/demo%20for%20legaldeepai%20original%20(1)%20(1).mp4";
  
  return (
    <div className="relative group max-w-4xl mx-auto">
      {/* Clean, minimal styling */}
      <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
};
