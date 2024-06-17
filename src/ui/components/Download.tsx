// create a button component
import React from 'react';
const url = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
export default function Download() {
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
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='link'
          type='text'
          placeholder='Add URL to download'
        />
      </div>
      <div className='inline-flex'>
        <button
          onClick={() => {
            window.electronAPI.addDownloadLink(url);
            console.log('clicked');
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

        <button
          className='btn btn-gray'
          onClick={() => {
            console.log('cancel');
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
