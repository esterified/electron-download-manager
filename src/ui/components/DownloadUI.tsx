/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownloadList } from './DownloadList';
import React, { useCallback, useEffect } from 'react';
import { IDownloadsUI } from '../../lib/types';
import { IoPlayOutline } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuFolderDown } from 'react-icons/lu';
import { FaRegCirclePause } from 'react-icons/fa6';
import MyModal from './Modal';
import { Button } from '@headlessui/react';

const defautlurl = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
const buttonMarkUp = [
  {
    id: 'play' as const,
    icon: <IoPlayOutline size={'26px'} />,
    enabled: false,
  },
  {
    id: 'pause' as const,
    icon: <FaRegCirclePause size={'26px'} />,
    enabled: false,
  },
  {
    id: 'delete' as const,
    icon: <RiDeleteBin5Line size={'26px'} />,
    enabled: false,
  },
  {
    id: 'folder' as const,
    icon: <LuFolderDown size={'26px'} />,
    enabled: true,
  },
];
type ButtonMarkup = typeof buttonMarkUp;
export default function DownloadUI() {
  const [url, setUrl] = React.useState(defautlurl);
  const [downloads, setDownloads] = React.useState<IDownloadsUI[]>([]);

  const downloadIsChecked = downloads.some((d) => d.checked === true);

  const runBulkOperation = useCallback(
    async (label: ButtonMarkup[0]['id']) => {
      const obj: Record<ButtonMarkup[0]['id'], () => void> = {
        play: () => {
          const ids = downloads
            .filter((d) => d.checked === true)
            .map((m) => m.id);
          window.electronAPI.bulkPlayDownload(ids);
        },
        pause: () => {
          const ids = downloads
            .filter((d) => d.checked === true)
            .map((m) => m.id);
          window.electronAPI.bulkPauseDownload(ids);
        },
        delete: () => {
          const ids = downloads
            .filter((d) => d.checked === true)
            .map((m) => m.id);
          window.electronAPI.bulkDeleteDownload(ids);
        },
        folder: async () => {
          const result = await window.electronAPI.openDir(['openDirectory']);

          if (result) {
            console.log(result);
            // control[ext.name] = result;
            // setState({ builtin, control });
          }
        },
      };

      await obj[label]();
    },
    [downloads]
  );
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  const parseAndSetDownloads = (d: any) => {
    const json = JSON.parse(d);
    console.log(json);
    setDownloads(json);
  };
  React.useEffect(() => {
    window.electronAPI.onDownloadCompleted(async (d: string) => {
      parseAndSetDownloads(d);
    });
    (async () => {
      const getDownloads = await window.electronAPI.getDownloads();
      parseAndSetDownloads(getDownloads);
    })();
  }, []);
  return (
    <div>
      <div className='bg-header px-2 py-2 inline-flex gap-2 border-b-2 border-black w-full'>
        <MyModal url={url} setUrl={React.useCallback(setUrl, [setUrl])} />
        {buttonMarkUp.map(({ id, icon }, i) => (
          <button
            key={i}
            className={`btn disabled:opacity-20 disabled:hover:bg-[unset] hover:bg-gray-700`}
            disabled={!downloadIsChecked}
            onClick={async () => {
              runBulkOperation(id);

              // alert();
            }}
          >
            {icon}
          </button>
        ))}
      </div>
      {/* add a table to show a list of download urls */}
      <div className='pills p-1'>
        <Button className='text-xs p-1 bg-slate-900'>All</Button>
      </div>
      <div className='p-1'>
        <DownloadList
          downloads={downloads}
          setDownloads={useCallback(setDownloads, [setDownloads])}
        />
      </div>
    </div>
  );
}
