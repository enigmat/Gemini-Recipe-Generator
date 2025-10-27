import React from 'react';

const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M13.5 21v-7.5A.75.75 0 0114.25 12h.01a.75.75 0 01.75.75v7.5m-3.75-7.5A.75.75 0 0010.5 12h-.01a.75.75 0 00-.75.75v7.5m-3.75 0v-7.5A.75.75 0 017.5 12h.01a.75.75 0 01.75.75v7.5m-3.75 0h13.5m-13.5 0v-7.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v7.5m5.25 0v-4.5a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v4.5m0 0V21m-8.625-1.125a18.625 18.625 0 0115.25 0m-15.25 0a18.625 18.625 0 0015.25 0M12 3.75a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75a.75.75 0 01-.75-.75v-.01a.75.75 0 01.75-.75z"
    />
  </svg>
);

export default StoreIcon;