import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FaPlus } from "react-icons/fa6";
import React, { useState } from "react";

export default function MyModal({
  url,
  setUrl,
}: {
  url: string;
  setUrl: (a: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <button className="btn-primary" onClick={open}>
        <FaPlus size={"26px"} />
      </button>

      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => {
            console.log("close");
          }}
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-zinc-700 px-0 pb-6 pt-0 backdrop-blur-2xl">
                  <DialogTitle
                    as="h4"
                    className="relative rounded-t-xl bg-zinc-800 px-4 py-1 text-sm/7 text-white"
                  >
                    Add Download
                    {/* add modal cross button */}
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                      onClick={close}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </DialogTitle>
                  <div className="px-6 pt-2">
                    <div>
                      <div className="mb-4">
                        <label
                          className="mb-1 block text-sm text-white"
                          htmlFor="link"
                        >
                          Enter URL
                        </label>
                        <input
                          className="focus:shadow-outline w-full appearance-none rounded border border-gray-500 bg-slate-700 px-3 py-2 text-xs leading-tight text-white shadow focus:outline-none"
                          id="link"
                          type="text"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="Add URL to download"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-end gap-2">
                      <Button
                        className="btn min-w-20 bg-zinc-800 py-1 text-sm font-normal text-white"
                        onClick={close}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={async () => {
                          await window.electronAPI.addDownloadLink(url);
                          setIsOpen(false);
                        }}
                        className="btn-primary min-w-20 py-1 text-sm font-normal"
                        disabled={!url}
                      >
                        Ok
                      </Button>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
