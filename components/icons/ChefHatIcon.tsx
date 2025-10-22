
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
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15v5h14v-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.18,15.15A7.5,7.5,0,0,1,12,7.5a7.5,7.5,0,0,1,6.82,7.65" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4,12.5a4,4,0,0,1,4-4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16,8.5a4,4,0,0,1,4,4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9,6.5a4,4,0,0,1,6,0" />
  </svg>
);

export default ChefHatIcon;
