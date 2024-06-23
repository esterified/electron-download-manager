import { PiCaretUpBold, PiCaretDownBold } from "react-icons/pi";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { IDownloadsUI } from "../../lib/types";

export const Footer = ({
  download: dl,
  disabledButton,
  ...props
}: Record<string, IDownloadsUI | string> | null) => {
  let download: IDownloadsUI = null;

  if (typeof dl !== "string") {
    download = dl;
  }
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      <div className="footer w-full">
        <div
          className={twMerge(
            "m-1 overflow-hidden border border-gray-600 bg-slate-800 transition-[height,border] duration-300 ease-in",
            open ? "h-[200px]" : "m-0 h-0 border-0",
          )}
        >
          <div className="relative m-1 flex items-center justify-center border border-gray-600 bg-black py-1">
            <span>General title</span>
            <button
              className="absolute right-[10px] align-middle"
              onClick={() => {
                setOpen(false);
              }}
            >
              &#10005;
            </button>
          </div>
          <div className="body">
            <img src={download?.filepath || ""} alt="" />
          </div>
        </div>
        <div className="bg-header w-full border-t-2 border-gray-800 px-2 py-2 text-right">
          <div
            className={twMerge(
              !!disabledButton && "pointer-events-none opacity-0",
              "w-full",
            )}
          >
            <span className="mr-1"> {download?.filename}</span>
            <button
              className="align-middle"
              onClick={() => {
                setOpen(!open);
              }}
            >
              {open ? (
                <PiCaretUpBold className="text-n_blue" size={20} />
              ) : (
                <PiCaretDownBold className="text-n_blue" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
