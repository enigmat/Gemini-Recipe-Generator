import React from 'react';

const ServerStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 20.25h12m-7.5-3.75v3.75m3.75-3.75v3.75m-7.5-3.75L3 16.5m18 0l-3.75 3.75M3 16.5h18M3 12h18m-7.5 4.5v-4.5m3.75 4.5v-4.5m-7.5 4.5v-4.5M3 7.5h18M3 7.5L7.5 3m9 4.5L21 3"
    />
  </svg>
);

export default ServerStackIcon;
