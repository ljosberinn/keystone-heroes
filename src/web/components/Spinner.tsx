import { useEffect, useState } from "react";

// graciously reverse engineered from the WoW Armory
export function Spinner(): JSX.Element | null {
  const [render, setRender] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, 750);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!render) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="w-full h-full motion-safe:animate-pulse"
    >
      <defs>
        <mask id="d" mask-type="alpha">
          <path
            fill="#FFF"
            d="M16.866 19.447h8.542s-.396 2.005-.305 3.003c.377 3.929 2.859 14.703 2.859 14.703l4.047-16.888 4.154 16.546s2.483-14.514 2.483-15.494c0-.998-.972-1.87-.972-1.87h8.975s-1.925 1.727-2.535 4.227c-.812 3.191-3.554 19.306-3.554 20.331 0 1.582 1.034 2.877 1.034 2.877h-8.38s.287-.881.287-2.355c0-1.475-1.365-8.508-1.365-8.508s-1.638 7.284-1.638 8.597c0 1.331.54 2.266.54 2.266h-8.74s1.654-1.205 1.59-2.355c-.188-3.3-4.667-20.413-4.972-21.726-.558-2.464-2.05-3.354-2.05-3.354z"
          />
        </mask>
        <mask id="b" mask-type="alpha">
          <path
            fill="#FFF"
            d="M62.997 32.009c.016-.117-.036-.216-.108-.288l-3.129-3.129C58.211 15.885 48.135 5.817 35.441 4.26l-3.145-3.149c-.072-.072-.189-.108-.288-.108-.099 0-.214.036-.287.117l-3.144 3.14C15.88 5.813 5.823 15.866 4.262 28.561L1.12 31.703c-.073.072-.117.18-.117.288 0 .108.044.215.117.288l3.138 3.137c1.546 12.705 11.615 22.79 24.329 24.343l3.117 3.12c.072.073.188.117.286.117.108 0 .216-.044.306-.117l3.106-3.116C48.114 58.22 58.208 48.134 59.76 35.425l3.129-3.129c.072-.09.124-.188.108-.287zM36.814 54.266l-4.824-2.663-4.802 2.658c-8.709-1.877-15.575-8.731-17.452-17.443l2.67-4.827L9.74 27.18c1.882-8.707 8.745-15.563 17.449-17.442l4.819 2.658 4.81-2.661c8.71 1.874 15.571 8.727 17.457 17.433l-2.673 4.841 2.675 4.831c-1.883 8.707-8.748 15.555-17.463 17.426z"
          />
        </mask>
        <linearGradient
          id="c"
          x1="-11"
          x2="17.5"
          y1="-21.5"
          y2="24"
          gradientUnits="userSpaceOnUse"
          spreadMethod="pad"
        >
          <stop offset="0%" stopColor="#FFC560" />
          <stop offset="13%" stopColor="#FECF69" />
          <stop offset="26%" stopColor="#FDD872" />
          <stop offset="47%" stopColor="#FAC839" />
          <stop offset="68%" stopColor="#F8B700" />
          <stop offset="76%" stopColor="#F8B700" />
          <stop offset="86%" stopColor="#F8B700" />
          <stop offset="92%" stopColor="#EDA219" />
          <stop offset="99%" stopColor="#E38E32" />
        </linearGradient>
        <clipPath id="a">
          <path d="M0 0h64v64H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <g mask="url(#b)">
          <path
            fill="url(#c)"
            d="M0-40.25c22.214 0 40.25 18.036 40.25 40.25S22.214 40.25 0 40.25-40.25 22.214-40.25 0-22.214-40.25 0-40.25z"
            transform="translate(31.25 30.75)"
          />
        </g>
        <g mask="url(#d)">
          <path
            fill="url(#c)"
            d="M0-40.25c22.214 0 40.25 18.036 40.25 40.25S22.214 40.25 0 40.25-40.25 22.214-40.25 0-22.214-40.25 0-40.25z"
            transform="translate(31.25 30.75)"
          />
        </g>
      </g>
    </svg>
  );
}
