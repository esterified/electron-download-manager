/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GiHamburgerMenu } from 'react-icons/gi';

import { DownloadList } from './DownloadList';
import React, { useCallback, useContext, useEffect } from 'react';
import { DownloadStatus, IDownloadsUI } from '../../lib/types';
import { IoPlayOutline } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuFolderDown } from 'react-icons/lu';
import { FaRegCirclePause } from 'react-icons/fa6';
import MyModal from './Modal';
import { Button } from '@headlessui/react';
import { Download } from '@prisma/client';
import { Footer } from './Footer';
import { PageContext } from './Contexts';

export function Preferences() {
  const { page, setPage } = useContext(PageContext);
  const [downloads, setDownloads] = React.useState<IDownloadsUI[]>([]);
  const [highlightIndex, sethighlightIndex] = React.useState<number | null>(
    null
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function

  React.useEffect(() => {
    console.log('object');
  }, []);
  return (
    <div className='ec_container flex flex-col flex-nowrap'>
      <div className='draggable bg-header px-2 py-0.5 flex flex-row flex-nowrap items-center justify-center w-full'>
        <span> Electron Download Manager</span>
      </div>
      <div className='draggable bg-header px-2 py-2 flex flex-row flex-nowrap items-center justify-between gap-2 border-b-2 border-black w-full'>
        <div className='no_draggable inline-flex'></div>
        <div className='no_draggable'>
          <button
            className='align-middle'
            onClick={() => {
              setPage('home');
            }}
          >
            Go back
          </button>
        </div>
      </div>
      {/* add a table to show a list of download urls */}
      <div className='m-1 border-gray-600 border flex-grow overflow-y-scroll no-scrollbar'>
        <div className='text-center text-3xl'>Hellow World</div>
      </div>
      <Footer
        className=''
        download={downloads[highlightIndex] as IDownloadsUI}
      />
    </div>
  );
}
