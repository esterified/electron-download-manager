import { Checkbox } from '@headlessui/react';
import React from 'react';
import { IDownloadsUI } from '../../lib/types';
import { MdCancel } from 'react-icons/md';
const TABLE_HEADERS = ['', 'URL', 'Status', 'Percentage', 'Actions'];

export function DownloadList({
  downloads,
  setDownloads,
}: {
  downloads: IDownloadsUI[];
  setDownloads: (cb: (a: IDownloadsUI[]) => IDownloadsUI[]) => void;
}) {
  return (
    <table className='table-auto text-xs border-collapse w-full '>
      <thead>
        <tr className=''>
          {TABLE_HEADERS.map((it, i) => (
            <th
              key={i}
              className='border border-gray-400 px-1 py-1 font-normal text-xs text-left'
            >
              {it}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {downloads?.map((it, i) => (
          <tr key={i}>
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
            <td className='table_cells'>{it.url}</td>
            <td className='table_cells'>{it.status.toUpperCase()}</td>
            <td className='table_cells'>{`${it.percentage}%`}</td>
            <td className='table_cells'>
              <button
                onClick={async () => {
                  window.electronAPI.cancelDownloadLink(it.url);
                }}
                className='btn inline-flex items-center'
              >
                <MdCancel size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
