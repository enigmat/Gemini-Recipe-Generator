import React from 'react';

const UsersGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.007 1.07-2.122 1.5-3.282s.79-2.322 1.25-3.528M15 14.118A9.054 9.054 0 0112 15c-1.605 0-3.097-.47-4.472-1.282"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15a2.25 2.25 0 01-2.25-2.25V8.25a2.25 2.25 0 012.25-2.25h.375a2.25 2.25 0 012.25 2.25v4.5a2.25 2.25 0 01-2.25 2.25h-.375z"
    />
  </svg>
);

export default UsersGroupIcon;
