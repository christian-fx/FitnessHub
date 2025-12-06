import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L12 8" />
      <path d="M12 16L12 22" />
      <path d="M17 12H22" />
      <path d="M2 12H7" />
      <path d="M19.07 4.93L16.24 7.76" />
      <path d="M7.76 16.24L4.93 19.07" />
      <path d="M19.07 19.07L16.24 16.24" />
      <path d="M7.76 7.76L4.93 4.93" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
