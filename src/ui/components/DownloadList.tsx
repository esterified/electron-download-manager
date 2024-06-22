import { Checkbox } from '@headlessui/react';
import React, { useState } from 'react';
import { DownloadStatus, IDownloadsUI } from '../../lib/types';
import { twMerge } from 'tailwind-merge';
import { FaFolder } from 'react-icons/fa';
// import { MdCancel } from 'react-icons/md';

export function DownloadList({
  downloads,
  setDownloads,
}: {
  downloads: (IDownloadsUI & { status: DownloadStatus })[];
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
    'Status',
    'Percentage',
    'Size',
    'Added',
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
                  if (!it.filepath) return;
                  const result = await window.electronAPI.openDir(
                    ['openFile'],
                    it.filepath.replace(it.filename, '')
                  );
                  console.log('done');
                }}
              >
                <FaFolder size={18} />
              </button>
              <span
                onDoubleClick={() => {
                  console.log('object');
                }}
                className='ms-2'
              >
                {it.filename}
              </span>
            </td>
            <td className='table_cells'>
              <div className='w-full'>{it.status.toUpperCase()}</div>
              {it.status === 'downloading' && (
                <div className='text-center font-bold text-white'>
                  {`${it.speed}`}
                </div>
              )}
            </td>
            <td className='table_cells'>
              <div className='w-full bg-neutral-200 dark:bg-neutral-600'>
                <div
                  className={twMerge(
                    it.status === 'paused'
                      ? 'bg-yellow-500'
                      : it.status === 'completed'
                      ? 'bg-green-500'
                      : 'bg-blue-500',
                    'p-1 text-center text-xs font-bold leading-none text-white'
                  )}
                  style={{ width: `${it.percentage}%` }}
                >
                  {it.percentage}%
                </div>
              </div>
            </td>
            <td className='table_cells'>{`${it.filesize}`}</td>
            <td className='table_cells'>
              {new Date(it.createdAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
