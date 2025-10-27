import React from 'react';

const ShoppingCartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.102-.816l4.418-8.49a.75.75 0 00-.154-.882A.75.75 0 0020.25 3H4.498c-.538 0-.975.437-.975.975s.437.975.975.975h14.232l-3.09 5.945H7.5"
    />
  </svg>
);

export default ShoppingCartIcon;
