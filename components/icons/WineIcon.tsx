import React from 'react';

const WineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 21v-8.25M15.75 21H8.25M12 3v5.25m0 0c-1.48.575-2.756 1.5-3.5 2.5m3.5-2.5c1.48.575 2.756 1.5 3.5 2.5m-7.5 0a7.5 7.5 0 1115 0m-15 0h15" />
</svg>
);

export default WineIcon;