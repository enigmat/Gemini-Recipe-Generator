import React from 'react';
import { Video } from '../types';
import XIcon from './icons/XIcon';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-black rounded-lg shadow-2xl w-11/12 md:max-w-4xl aspect-video relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
          aria-label="Close video player"
        >
          <XIcon className="w-8 h-8" />
        </button>
        <video
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full h-full rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayerModal;