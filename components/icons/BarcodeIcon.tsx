import React from 'react';

const BarcodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M3.75 4.5v15a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-15m-16.5 0h16.5m-16.5 0H3.75m16.5 0h.008v.008H20.25V4.5m-16.5 0v.008H3.75V4.5m0 3.75v.008h.008v-.008H3.75m3.75 0v.008h.008v-.008H7.5m3.75 0v.008h.008v-.008H11.25m3.75 0v.008h.008v-.008H15m3.75 0v.008h.008v-.008H18.75m-15 3.75v.008h.008v-.008H3.75m3.75 0v.008h.008v-.008H7.5m3.75 0v.008h.008v-.008H11.25m3.75 0v.008h.008v-.008H15m3.75 0v.008h.008v-.008H18.75m-15 3.75v.008h.008v-.008H3.75m3.75 0v.008h.008v-.008H7.5m3.75 0v.008h.008v-.008H11.25m3.75 0v.008h.008v-.008H15m3.75 0v.008h.008v-.008H18.75"
    />
  </svg>
);

export default BarcodeIcon;
