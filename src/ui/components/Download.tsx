// create a button component
import { ipcRenderer } from 'electron';
import React from 'react';
import { IDownloads } from 'src/lib/types';
const defautlurl = `https://videos.pexels.com/video-files/3195394/3195394-hd_1280_720_25fps.mp4`;
export default function Download() {
  // url state
  const [url, setUrl] = React.useState(defautlurl);
  const [downloads, setDownloads] = React.useState<IDownloads[]>([]);
  // download state populate on mount
  React.useEffect(() => {
    window.electronAPI.onDownloadCompleted(async (d: string) => {
      const json = JSON.parse(d);
      console.log(json);
      setDownloads(json);
    });
    (async () => {
      const getDownloads = await window.electronAPI.getDownloads();
      const json = JSON.parse(getDownloads);
      console.log(json);
      // console.log(json);
      setDownloads(json);
    })();
  }, []);
  return (
    <div>
      <div className='mb-4'>
        <label
          className='block text-gray-700 text-sm font-bold mb-2'
          htmlFor='link'
        >
          URL
        </label>
        <input
          className='shadow appearance-none border rounded w-full py-2 px-3 text-xs text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='link'
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Add URL to download'
        />
      </div>
      <div className='mb-4'>
        <div className='inline-flex'>
          <button
            onClick={async () => {
              await window.electronAPI.addDownloadLink(url);
              const getDownloads = await window.electronAPI.getDownloads(url);
              const json = JSON.parse(getDownloads);
              setDownloads(json);

              console.log('clicked:addDownloadLink', json);
            }}
            className='btn btn-gray inline-flex items-center'
          >
            <svg
              className='fill-current w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z' />
            </svg>
            <span>Download</span>
          </button>
        </div>
      </div>
      {/* add a table to show a list of download urls */}
      <h3>Downloads</h3>
      <table className='table-auto text-sm border-collapse w-full'>
        <thead>
          <tr>
            <th className='border px-2 py-1'>URL</th>
            <th className='border px-2 py-1'>Status</th>
            <th className='border px-2 py-1'>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {downloads?.map((it, i) => (
            <tr key={i}>
              <td className='border px-2 py-1 text-xs'>{it.url}</td>
              <td className='border px-2 py-1'>{it.status}</td>
              <td className='border px-2 py-1'>
                <button
                  onClick={async () => {
                    window.electronAPI.cancelDownloadLink(url);
                  }}
                  className='btn btn-gray inline-flex items-center'
                >
                  <svg
                    className='fill-current w-4 h-4 mr-2'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                  >
                    <path d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z' />
                  </svg>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
