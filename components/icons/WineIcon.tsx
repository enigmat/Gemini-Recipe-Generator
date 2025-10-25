import React from 'react';

const WineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 3.094c.553-.306 1.18-.469 1.837-.469 2.41 0 4.375 1.966 4.375 4.375 0 .918-.282 1.768-.78 2.488S15.555 12 15.555 12H8.444s-.69-1.326-1.188-2.012C6.758 9.218 6.476 8.368 6.476 7.45c0-2.41 1.966-4.375 4.375-4.375.393 0 .774.053 1.141.155M12 12v9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21h7.5" />
  </svg>
);

export default WineIcon;