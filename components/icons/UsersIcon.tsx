import React from 'react';

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.969A4.502 4.502 0 0 1 12 15a4.502 4.502 0 0 1 5.474-3.416m-5.474 0a4.502 4.502 0 0 0-5.474-3.416A4.502 4.502 0 0 0 6 15a4.502 4.502 0 0 0 5.474 3.416M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export default UsersIcon;