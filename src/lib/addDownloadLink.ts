import { IpcMainEvent } from 'electron';
import { Downloader } from 'nodejs-file-downloader';

export const downloadHandler = async (event: IpcMainEvent, url: string) => {
  console.log('addDownloadLink', url);

  const downloader = new Downloader({
    url: url, //If the file name already exists, a new file with the name 200MB1.zip is created.
    directory: './downloads', //This folder will be created, if it doesn't exist.
    onProgress: function (percentage, chunk, remainingSize) {
      //Gets called with each chunk.
      console.log('% ', percentage);
      // console.log('Current chunk of data: ', chunk);
      const convertedremainingSize =
        remainingSize > 1024 * 1024
          ? `${remainingSize / 1024 / 1024}mb`
          : remainingSize > 1024
          ? `${remainingSize / 1024}kb`
          : `${remainingSize} bytes`;
      console.log('Remaining data: ', convertedremainingSize);
    },
  });
  try {
    const { filePath, downloadStatus } = await downloader.download(); //Downloader.download() resolves with some useful properties.

    console.log('All done');
  } catch (error) {
    //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
    //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
    console.log('Download failed', error);
  }
};
