import { PiCaretUpBold, PiCaretDownBold } from 'react-icons/pi';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { IDownloadsUI } from '../../lib/types';

export const Footer = ({
  download: dl,
  ...props
}: Record<string, IDownloadsUI | string>) => {
  let download: IDownloadsUI = null;

  if (typeof dl !== 'string') {
    download = dl;
  }
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      <div className=' footer w-full'>
        <div
          className={twMerge(
            ' m-1 border border-gray-600 transition-[height,border] duration-300 ease-in bg-slate-800 overflow-hidden',
            open ? 'h-[200px]' : 'h-0 border-0 m-0'
          )}
        >
          <div className=' bg-black relative flex justify-center items-center py-1 border m-1 border-gray-600'>
            <span>General title</span>
            <button
              className='align-middle absolute right-[10px]'
              onClick={() => {
                setOpen(false);
              }}
            >
              &#10005;
            </button>
          </div>
          <div className='body'>
            <img src={download?.filepath || ''} alt='' />
          </div>
        </div>
        <div className='text-right border-t-2 border-gray-800 bg-header px-2 py-2 w-full '>
          <span className='mr-1'> {download?.filename}</span>
          <button
            className='align-middle'
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? (
              <PiCaretUpBold className='text-n_blue' size={20} />
            ) : (
              <PiCaretDownBold className='text-n_blue' size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
