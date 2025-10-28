import React from 'react';
import { Video } from '../types';
import PlayCircleIcon from './icons/PlayCircleIcon';

interface VideoCardProps {
  video: Video;
  onPlay: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group transform hover:scale-105 transition-all duration-300"
      onClick={() => onPlay(video)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPlay(video) }}
      aria-label={`Play video: ${video.title}`}
    >
      <div className="relative">
        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircleIcon className="w-16 h-16 text-white" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-md font-semibold text-slate-800 truncate">{video.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;