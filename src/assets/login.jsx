import * as React from "react";

const LoginIcon = (props) => (
  <svg
    width="200"
    height="100"
    viewBox="0 0 200 100"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#f09433", stopOpacity: 1 }} />
        <stop offset="25%" style={{ stopColor: "#e6683c", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#dc2743", stopOpacity: 1 }} />
        <stop offset="75%" style={{ stopColor: "#cc2366", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#bc1888", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dy=".35em"
      fontFamily="Arial, sans-serif"
      fontSize="60"
      fontWeight="bold"
      fill="url(#grad)"
    >
      HMS
    </text>
  </svg>
);

export default LoginIcon;
