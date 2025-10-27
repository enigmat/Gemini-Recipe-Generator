import React from 'react';

const CrownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M13.23 4.838a2.25 2.25 0 00-2.46 0L3.623 9.472a2.25 2.25 0 00-1.07 1.954V18.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25v-7.324a2.25 2.25 0 00-1.07-1.954L13.23 4.838zM12 21V12.75"
    />
  </svg>
);

export default CrownIcon;
