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
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9.75 0h7.5A2.25 2.25 0 0021 18.75V16.5M3 16.5V18.75A2.25 2.25 0 005.25 21h7.5M3 16.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 16.5m-18 0v-2.25A2.25 2.25 0 015.25 12h13.5A2.25 2.25 0 0121 14.25v2.25m-13.5-3.375V6.375" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.375L13.5 4.125l-2.25 2.25" />
  </svg>
);

export default MortarPestleIcon;
