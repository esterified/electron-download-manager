import { DownloadList } from './DownloadList';
import React, { useCallback } from 'react';
import { IDownloads, IDownloadsUI } from '../../lib/types';
import { IoPlayOutline } from 'react-icons/io5';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { LuFolderDown } from 'react-icons/lu';
import { FaRegCirclePause } from 'react-icons/fa6';
import MyModal from './Modal';
import { Button } from '@headlessui/react';

const defautlurl = `https://videos.pexels.com/video-files/3195394/3195394-hd_1280_720_25fps.mp4`;

export default function DownloadUI() {
  const [url, setUrl] = React.useState(defautlurl);
  const [downloads, setDownloads] = React.useState<IDownloadsUI[]>([]);
  const parseAndSetDownloads = (d: any) => {
    const json = JSON.parse(d);
    console.log(json);
    setDownloads(json);
    // setDownloads((prev) => {
    //   return json.map((a: any, i: any) => ({
    //     ...a,
    //     checked: prev[i]?.checked || false,
    //   }));
    // });
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

        <button className='btn hover:bg-gray-700 active:ring-2'>
          <IoPlayOutline size={'26px'} />
        </button>
        <button className='btn hover:bg-gray-700 active:ring-2 '>
          <FaRegCirclePause size={'26px'} />
        </button>
        <button className='btn hover:bg-gray-700 active:ring-2 '>
          <RiDeleteBin5Line size={'26px'} />
        </button>
        <button className='btn hover:bg-gray-700 active:ring-2 '>
          <LuFolderDown size={'26px'} />
        </button>
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
