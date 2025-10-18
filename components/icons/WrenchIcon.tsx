import React from 'react';

const WrenchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.495-2.495a1.5 1.5 0 0 1 2.122 0l2.12 2.12a1.5 1.5 0 0 1 0 2.122l-2.495 2.495M3 12l9.345 9.345" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 7.125-3.839 3.84M5.625 19.5 3 16.875" />
  </svg>
);

export default WrenchIcon;