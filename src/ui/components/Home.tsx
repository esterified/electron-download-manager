/* eslint-disable @typescript-eslint/no-explicit-any */
import { GiHamburgerMenu } from "react-icons/gi";

import { DownloadList } from "./DownloadList";
import React, { useCallback, useContext } from "react";
import { DownloadStatus, IDownloadsUI } from "../../lib/types";
import { IoPlayOutline } from "react-icons/io5";
import { RiDeleteBin5Line } from "react-icons/ri";
import { LuFolderDown } from "react-icons/lu";
import { FaRegCirclePause } from "react-icons/fa6";
import MyModal from "./Modal";
import { Button, Transition } from "@headlessui/react";
import { Download } from "@prisma/client";
import { Footer } from "./Footer";
import { PageContext } from "./Contexts";

const defautlurl = `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
const buttonMarkUp = [
  {
    id: "play" as const,
    icon: <IoPlayOutline size={"26px"} />,
    enabled: false,
  },
  {
    id: "pause" as const,
    icon: <FaRegCirclePause size={"26px"} />,
    enabled: false,
  },
  {
    id: "delete" as const,
    icon: <RiDeleteBin5Line size={"26px"} />,
    enabled: false,
  },
  {
    id: "folder" as const,
    icon: <LuFolderDown size={"26px"} />,
    enabled: true,
  },
];
type ButtonMarkup = typeof buttonMarkUp;
export default function Home() {
  const { page } = useContext(PageContext);

  const [url, setUrl] = React.useState(defautlurl);
  const [downloads, setDownloads] = React.useState<IDownloadsUI[]>([]);
  const [highlightIndex, sethighlightIndex] = React.useState<number | null>(
    null,
  );
  const downloadIsChecked = downloads.some((d) => d.checked === true);

  const runBulkOperation = useCallback(
    async (label: ButtonMarkup[0]["id"]) => {
      const obj: Record<ButtonMarkup[0]["id"], () => void> = {
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
          const result = await window.electronAPI.openDir(["openDirectory"]);
          if (result) {
            console.log(result);
          }
        },
      };

      await obj[label]();
    },
    [downloads],
  );

  const parseAndSetDownloads = (d: any) => {
    const json: Download[] = JSON.parse(d);
    console.log("refresh");
    setDownloads(json.map((a) => ({ ...a, checked: false })));
  };
  const parseAndsyncRealtimeProgress = (d: any) => {
    const json: Download[] = JSON.parse(d);
    console.log("realtime");
    setDownloads((prev) => {
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
    <Transition
      as="div"
      className="ec_container bg_native absolute inset-0 flex flex-col flex-nowrap"
      show={page === "home"}
      enter="duration-700 transition-transform z-10"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform duration-700"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-0"
    >
      <div className="draggable bg-header flex w-full flex-row flex-nowrap items-center justify-center px-2 py-0.5">
        <span> Electron Download Manager</span>
      </div>
      <div className="draggable bg-header flex w-full flex-row flex-nowrap items-center justify-between gap-2 border-b-2 border-black px-2 py-2">
        <div className="no_draggable inline-flex px-1">
          <MyModal url={url} setUrl={React.useCallback(setUrl, [setUrl])} />
          {buttonMarkUp.map(({ id, icon }, i) => (
            <button
              key={i}
              className={`btn hover:bg-gray-700 disabled:opacity-20 disabled:hover:bg-[unset]`}
              disabled={!downloadIsChecked}
              onClick={async () => {
                runBulkOperation(id);
              }}
            >
              {icon}
            </button>
          ))}
        </div>
        <div className="no_draggable">
          <button
            className="align-middle"
            onClick={() => {
              window.electronAPI.showSettingsMenu(page);
            }}
          >
            <GiHamburgerMenu size={"22px"} />
          </button>
        </div>
      </div>
      <div className="no-scrollbar m-1 flex-grow overflow-y-scroll border border-gray-600">
        <div className="pills p-1">
          <Button className="bg-slate-900 p-1 text-xs">All</Button>
        </div>
        <div className="p-1">
          <DownloadList
            downloads={
              downloads as (IDownloadsUI & {
                status: DownloadStatus;
              })[]
            }
            setDownloads={useCallback(setDownloads, [setDownloads])}
            highlightIndex={highlightIndex}
            sethighlightIndex={useCallback(sethighlightIndex, [
              sethighlightIndex,
            ])}
          />
        </div>
      </div>
      <Footer
        className=""
        download={downloads[highlightIndex] as IDownloadsUI}
      />
    </Transition>
  );
}
