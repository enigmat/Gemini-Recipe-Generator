import React from 'react';

const CrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6.375 12 5.25l-1.5 1.125M21 15.75c-1.5-1.5-1.5-4.5 0-6s1.5 4.5 0 6Zm-18 0c1.5-1.5 1.5-4.5 0-6s-1.5 4.5 0 6Zm4.5-9L12 12.75 3 6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 6.75-9 6-9-6" />
  </svg>
);

export default CrownIcon;
