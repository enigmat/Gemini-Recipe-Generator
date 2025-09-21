
import React from 'react';

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a12.025 12.025 0 0 1-5.84 7.38m-6.36-4.52a4.5 4.5 0 0 1 6.36-6.36m6.36 6.36a6.75 6.75 0 0 1-6.36-6.36m6.36 6.36a12.025 12.025 0 0 1-5.84 7.38m5.84-7.38a4.5 4.5 0 0 0-6.36-6.36m0 0a6.75 6.75 0 0 1 6.36 6.36m-6.36-6.36a12.025 12.025 0 0 0-5.84 7.38m-6.36-4.52a4.5 4.5 0 0 0 6.36-6.36" />
  </svg>
);

export default LeafIcon;
