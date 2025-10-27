import React from 'react';

const RefrigeratorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75h15A2.25 2.25 0 0121.75 6v12a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 18V6A2.25 2.25 0 014.5 3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.25h15" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 11.25h2.25" />
  </svg>
);

export default RefrigeratorIcon;
