import React from 'react';
import { Video } from '../types';
import XIcon from './icons/XIcon';

interface VideoPlayerModalProps {
    video: Video;
    onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-player-title"
            onClick={onClose}
        >
            <div
                className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center">
                     <h2 id="video-player-title" className="text-xl font-bold text-white flex-1 pr-4 truncate">
                        {video.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-300 hover:bg-white/20"
                        aria-label="Close video player"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="aspect-video">
                    <video
                        src={video.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerModal;
