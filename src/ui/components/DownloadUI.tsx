/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GiHamburgerMenu } from 'react-icons/gi';

import { DownloadList } from './DownloadList';
import React, { useCallback, useEffect } from 'react';
import { DownloadStatus, IDownloadsUI } from '../../lib/types';
import { IoPlayOutline } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuFolderDown } from 'react-icons/lu';
import { FaRegCirclePause } from 'react-icons/fa6';
import MyModal from './Modal';
import { Button } from '@headlessui/react';
import { Download } from '@prisma/client';

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
    const json: Download[] = JSON.parse(d);
    console.log('refresh');
    setDownloads(json.map((a) => ({ ...a, checked: false })));
  };
  const parseAndsyncRealtimeProgress = (d: any) => {
    const json: Download[] = JSON.parse(d);
    console.log('realtime');
    setDownloads((prev) => {
      // console.log(json.map((a) => a.speed).join(','));

      const updated = prev.map((d) => {
        const jsonF = json.find((a) => a.id === d.id);
        return d.id === jsonF?.id
          ? { ...d, speed: jsonF.speed, percentage: jsonF.percentage }
          : d;
      });
      return updated;
    });
  };
  React.useEffect(() => {
    window.electronAPI.onDownloadCompleted(async (d: string) => {
      parseAndSetDownloads(d);
    });
    window.electronAPI.onDownloadRealtimeSync(async (d: string) => {
      parseAndsyncRealtimeProgress(d);
    });
    (async () => {
      const getDownloads = await window.electronAPI.getDownloads();
      parseAndSetDownloads(getDownloads);
    })();
  }, []);
  return (
    <div>
      <div className='draggable bg-header px-2 py-0.5 flex flex-row flex-nowrap items-center justify-center w-full'>
        <span> Electron Download Manager</span>
      </div>
      <div className='draggable bg-header px-2 py-2 flex flex-row flex-nowrap items-center justify-between gap-2 border-b-2 border-black w-full'>
        <div className='no_draggable inline-flex'>
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
        <div className='no_draggable'>
          <button
            className='align-middle'
            onClick={() => {
              window.electronAPI.showSettingsMenu();
            }}
          >
            <GiHamburgerMenu size={'22px'} />
          </button>
        </div>
      </div>
      {/* add a table to show a list of download urls */}
      <div className='pills p-1'>
        <Button className='text-xs p-1 bg-slate-900'>All</Button>
      </div>
      <div className='p-1'>
        <DownloadList
          downloads={downloads as (IDownloadsUI & { status: DownloadStatus })[]}
          setDownloads={useCallback(setDownloads, [setDownloads])}
        />
      </div>
      <div className='text-right footer bg-header px-2 py-2 gap-2 border-t-2 border-gray-800 w-full fixed bottom-0 left-0'>
        caret bar
      </div>
    </div>
  );
}
