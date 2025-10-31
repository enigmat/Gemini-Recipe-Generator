import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3.75 21V9.75l8.25-8.25 8.25 8.25V21h-5.25v-6h-6v6H3.75z" 
    />
  </svg>
);

export default HomeIcon;
