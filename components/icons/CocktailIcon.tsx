import React from 'react';

const CocktailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.75L6 9h12l-5.25-5.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21h7.5" />
  </svg>
);

export default CocktailIcon;