import { Checkbox } from "@headlessui/react";
import React from "react";
import { DownloadStatus, IDownloadsUI } from "../../lib/types";
import { twMerge } from "tailwind-merge";
import { FaFolder } from "react-icons/fa";
// import { MdCancel } from 'react-icons/md';

export function DownloadList({
  downloads,
  setDownloads,
  highlightIndex,
  sethighlightIndex,
}: {
  downloads: (IDownloadsUI & { status: DownloadStatus })[];
  setDownloads: (cb: (a: IDownloadsUI[]) => IDownloadsUI[]) => void;
  highlightIndex: number | null;
  sethighlightIndex: (a: number | null) => void;
}) {
  const [bulkActions, setBulkActions] = React.useState(false);
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
      key="checkbox"
      checked={bulkActions}
      onChange={() => {
        setBulkActions(!bulkActions);
      }}
      className="group block size-4 rounded border bg-slate-500 data-[checked]:bg-slate-800"
    >
      <svg
        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Checkbox>,
    "Name",
    "Status",
    "Percentage",
    "Size",
    "Added",
  ];

  return (
    <table className="w-full table-auto border-collapse text-xs">
      <thead>
        <tr className="">
          {TABLE_HEADERS.map((it, i) => (
            <th key={i} className="table_cells text-left font-normal">
              {it}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {downloads?.map((it, i) => (
          <tr
            key={i}
            className={twMerge(
              "cursor-pointer border-x border-gray-600",
              highlightIndex === i &&
                "border-x-2 border-y-2 border-[var(--color-light-blue)]",
            )}
            onClick={() => sethighlightIndex(i)}
          >
            <td className="table_cells border-x-0">
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
                  className="group block size-4 rounded border bg-slate-500 data-[checked]:bg-slate-800"
                >
                  <svg
                    className="stroke-white opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
              }
            </td>
            <td className="table_cells border-x-0">
              <button
                className={"disabled:cursor-not-allowed disabled:opacity-55"}
                disabled={!it.filepath}
                onClick={async () => {
                  console.log(it.filepath);
                  if (!it.filepath) return;
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const result = await window.electronAPI.openDir(
                    ["openFile"],
                    it.filepath.replace(it.filename, ""),
                  );
                  console.log("done");
                }}
              >
                <FaFolder size={18} />
              </button>
              <span
                onDoubleClick={() => {
                  console.log("object");
                }}
                className="ms-2"
              >
                {it.filename}
              </span>
            </td>
            <td className="table_cells border-x-0">
              <div className="w-full">{it.status.toUpperCase()}</div>
              {it.status === "downloading" && (
                <div className="text-center font-bold text-white">
                  {`${it.speed}`}
                </div>
              )}
            </td>
            <td className="table_cells border-x-0">
              <div className="relative w-full bg-neutral-200 dark:bg-neutral-600">
                <div
                  className={twMerge(
                    it.status === "paused"
                      ? "bg-yellow-500"
                      : it.status === "completed"
                        ? "bg-green-500"
                        : "bg-blue-500",
                    "absolute left-0 top-0 h-full px-0 py-1 text-center text-xs font-bold leading-none text-white",
                  )}
                  style={{ width: `${it.percentage}%` }}
                ></div>
                <div className="relative left-0 top-0 text-center font-bold text-white">
                  {it.percentage}%
                </div>
              </div>
            </td>
            <td className="table_cells border-x-0">{`${it.filesize}`}</td>
            <td className="table_cells border-x-0">
              {new Date(it.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
