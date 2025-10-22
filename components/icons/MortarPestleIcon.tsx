import React from 'react';

const MortarPestleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.75l-4.5 4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18.75h12c1.036 0 1.875-.84 1.875-1.875V11.25c0-4.142-3.358-7.5-7.5-7.5S4.5 7.108 4.5 11.25v5.625c0 1.035.84 1.875 1.875 1.875Z" />
  </svg>
);

export default MortarPestleIcon;