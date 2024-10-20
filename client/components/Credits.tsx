import Image from "next/image";
import React from "react";

type Props = {};

const Credits = (props: Props) => {
  return (
    <div className="absolute bottom-4 text-xs text-neutral-500 flex items-center gap-1">
      Developed by
      <a
        href="https://sanyam.xyz"
        className="text-white hover:underline flex gap-1 items-center bg-neutral-800 p-1 border border-border/10 rounded-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image
          src="https://sanyam.xyz/_next/image?url=%2Flogo.png&w=32&q=75"
          height={12}
          width={12}
          alt="sanyam-logo"
          className="-rotate-45 select-none"
          draggable="false"
        />
        Sanyam
      </a>
      & Open-Sourced @{" "}
      <a
        href="https://github.com/SanyamPunia/on-snip"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:underline flex gap-1 items-center bg-neutral-800 p-1 border border-border/10 rounded-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-4 h-4 text-white"
        >
          <path
            fillRule="evenodd"
            d="M12 0a12 12 0 00-3.79 23.37c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.76.08-.75.08-.75 1.21.09 1.85 1.24 1.85 1.24 1.08 1.85 2.82 1.32 3.51 1.01.11-.79.42-1.32.76-1.63-2.66-.3-5.47-1.33-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.51.12-3.15 0 0 1-.32 3.3 1.23a11.52 11.52 0 016.01 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.64.25 2.85.12 3.15.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.63-5.49 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 0z"
            clipRule="evenodd"
          />
        </svg>
        on-snip
      </a>
    </div>
  );
};

export default Credits;
