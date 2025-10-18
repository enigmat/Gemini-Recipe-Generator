import React from 'react';

const CocktailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h18M5.25 13.5 8.25 3h7.5l3 10.5M8.25 3V1.5m7.5 1.5V1.5M12 13.5V21m-4 0h8" />
  </svg>
);

export default CocktailIcon;
