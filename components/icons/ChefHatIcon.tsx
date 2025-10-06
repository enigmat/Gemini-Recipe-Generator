
import React from 'react';

const ChefHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3-2.554Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214C14.465 6.647 12.37 8.443 12 10.5c-.37 2.057.577 4.31 2.234 5.968m-5.234-5.968a8.252 8.252 0 0 1-1.234-1.234" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.562a2.25 2.25 0 0 1 .632 1.527 2.25 2.25 0 0 1-.632 1.527" />
  </svg>
);

export default ChefHatIcon;
