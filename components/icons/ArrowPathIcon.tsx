import React from 'react';

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001a7.5 7.5 0 0 1-1.08 3.904l-2.022 2.022a7.5 7.5 0 0 1-1.08 3.904h-4.992v-2.022a5.25 5.25 0 0 0-1.03-3.093l-2.022-2.022a5.25 5.25 0 0 0-3.093-1.03v-4.992a7.5 7.5 0 0 1 3.904-1.08l2.022-2.022a7.5 7.5 0 0 1 3.904-1.08z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9h-4.5v-4.5" />
  </svg>
);

export default ArrowPathIcon;
