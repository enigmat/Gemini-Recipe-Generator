import React from 'react';

const ChefHatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M19.8 11.4c.5-1.5.8-3.1.8-4.7C20.6 3.1 18.2 1 15.3 1c-1.3 0-2.5.4-3.5 1.2-1-.8-2.2-1.2-3.5-1.2C5.5 1 3 3.1 3 6.7c0 1.6.3 3.2.8 4.7"/>
        <path d="M3 15h18v5H3z"/>
        <path d="M3 11.4C3 13.4 4.8 15 7 15h10c2.2 0 4-1.6 4-3.6"/>
    </svg>
);

export default ChefHatIcon;
