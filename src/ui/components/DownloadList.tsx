import { Checkbox } from '@headlessui/react';
import React, { useState } from 'react';
import { IDownloadsUI } from '../../lib/types';
import { twMerge } from 'tailwind-merge';
// import { MdCancel } from 'react-icons/md';

export function DownloadList({
  downloads,
  setDownloads,
}: {
  downloads: IDownloadsUI[];
  setDownloads: (cb: (a: IDownloadsUI[]) => IDownloadsUI[]) => void;
}) {
  // define a boolean state bulk actions
  const [bulkActions, setBulkActions] = React.useState(false);

  const [highlightIndex, sethighlightIndex] = useState<number | null>(null);

  // log something on state change of the bulk action
  React.useEffect(() => {
    setDownloads((prev: IDownloadsUI[]) => {
      const temp = [...prev];
      return temp.map((a) => ({
        ...a,
        checked: bulkActions,
      }));
    });
  }, [bulkActions, setDownloads]);
  const TABLE_HEADERS = [
    <Checkbox
      key='checkbox'
      checked={bulkActions}
      onChange={() => {
        setBulkActions(!bulkActions);
      }}
      className='group block size-4 rounded border bg-slate-500 data-[checked]:bg-slate-800'
    >
      <svg
        className='stroke-white opacity-0 group-data-[checked]:opacity-100'
        viewBox='0 0 14 14'
        fill='none'
      >
        <path
          d='M3 8L6 11L11 3.5'
          strokeWidth={2}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    </Checkbox>,
    'Name',
    'URL',
    'Status',
    'Percentage',
    'Speed',
    'Size',
  ];

  return (
    <table className='table-auto text-xs border-collapse w-full '>
      <thead>
        <tr className=''>
          {TABLE_HEADERS.map((it, i) => (
            <th key={i} className='table_cells text-left font-normal'>
              {it}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {downloads?.map((it, i) => (
          <tr
            key={i}
            className={twMerge(
              'cursor-pointer',
              highlightIndex === i &&
                'border-2 border-[var(--color-light-blue)]'
            )}
            onClick={() => sethighlightIndex(i)}
          >
            <td className='table_cells'>
              {
                <Checkbox
                  checked={it.checked || false}
                  onChange={() => {
                    setDownloads((prev: IDownloadsUI[]) => {
                      const temp = [...prev];
                      temp[i].checked = !temp[i].checked;
                      return temp;
                    });
                  }}
                  className='group block size-4 rounded border bg-slate-500 data-[checked]:bg-slate-800'
                >
                  <svg
                    className='stroke-white opacity-0 group-data-[checked]:opacity-100'
                    viewBox='0 0 14 14'
                    fill='none'
                  >
                    <path
                      d='M3 8L6 11L11 3.5'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </Checkbox>
              }
            </td>
            <td className='table_cells'>
              <button
                onClick={async () => {
                  console.log(it.filepath);
                  const result = await window.electronAPI.openDir(
                    ['openFile'],
                    it.filepath.replace(it.filename, '')
                  );
                  console.log('done');
                }}
              >
                [open]{' '}
              </button>
              <span className='ms-2'>{it.filename}</span>
            </td>
            <td className='table_cells'>{it.url}</td>
            <td className='table_cells'>{it.status.toUpperCase()}</td>
            <td className='table_cells'>{`${it.percentage}%`}</td>
            <td className='table_cells'>{`${it.speed}`}</td>
            <td className='table_cells'>{`${it.filesize}`}</td>
            {/* <td className='table_cells'>
              <button
                onClick={async () => {
                  window.electronAPI.cancelDownloadLink(it.id);
                }}
                className='btn inline-flex items-center'
              >
                <MdCancel size={18} />
              </button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
