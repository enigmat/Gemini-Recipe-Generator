import React from 'react';
import { Video } from '../types';
import PlayCircleIcon from './icons/PlayCircleIcon';

interface VideoCardProps {
    video: Video;
    onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group block bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm border border-border-color hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            aria-label={`Play video: ${video.title}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="relative aspect-video">
                <img
                    alt={video.title}
                    src={video.thumbnailUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <PlayCircleIcon className="w-16 h-16 text-white/80 transform group-hover:scale-110 transition-transform" />
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-text-primary leading-tight group-hover:text-primary transition-colors">
                    {video.title}
                </h3>
                 <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                    {video.description}
                </p>
            </div>
        </div>
    );
};

export default VideoCard;
