import React from 'react';

const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c.362-1.034 1.44-1.748 2.621-1.748s2.259.714 2.621 1.748c.362 1.034.033 2.141-.74 2.879l-1.125 1.125a.75.75 0 01-1.06 0l-1.125-1.125a2.25 2.25 0 01-.74-2.879zM12 15a.75.75 0 110-1.5.75.75 0 010 1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default QuestionMarkCircleIcon;
