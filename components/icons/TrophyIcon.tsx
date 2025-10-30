import React from 'react';

const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 00-4.873 1.378c.468.274.75.766.75 1.312v.012C1.377 22.251 3.511 24 6.375 24h11.25c2.864 0 5-1.749 5-2.548v-.012c0-.546-.282-1.038-.75-1.312A9.75 9.75 0 0016.5 18.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3V.75m0 2.25a2.25 2.25 0 00-2.25 2.25v.75h4.5v-.75a2.25 2.25 0 00-2.25-2.25z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h.008v.008H12V7.5z" />
  </svg>
);

export default TrophyIcon;