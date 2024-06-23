import { GiHamburgerMenu } from "react-icons/gi";
import { PiCaretLeftBold } from "react-icons/pi";
import React, { useContext } from "react";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from "@headlessui/react";
import { Footer } from "./Footer";
import { PageContext } from "./Contexts";

export function Preferences() {
  const { page, setPage } = useContext(PageContext);

  React.useEffect(() => {
    console.log("object");
  }, []);
  return (
    <Transition
      as="div"
      className="ec_container bg_native absolute inset-0 flex flex-col flex-nowrap"
      show={page === "setting"}
      enter="duration-700 transition-transform z-10"
      enterFrom="translate-x-full"
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
          <button
            className={`btn hover:bg-gray-700 disabled:opacity-20 disabled:hover:bg-[unset]`}
            disabled={false}
            onClick={async () => {
              setPage("home");
            }}
          >
            <PiCaretLeftBold size={"26px"} />
          </button>
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
      {/* add a table to show a list of download urls */}
      <div className="no-scrollbar m-1 flex-grow overflow-y-scroll border border-gray-600">
        <div>
          <TabGroup>
            <div className="flex flex-row p-6">
              <div>
                <TabList className="flex flex-col px-4 py-8 text-left">
                  <h1 className="text-2xl"> Preferences</h1>
                  <Tab className={"px-1 py-2 text-left text-sm"}>General</Tab>
                  <Tab className={"px-1 py-2 text-left text-sm"}>Advanced</Tab>
                  <Tab className={"px-1 py-2 text-left text-sm"}>Tab 3</Tab>
                </TabList>
              </div>
              <div>
                <TabPanels className="flex flex-col px-4 py-8 text-left">
                  <h1 className="text-2xl">General</h1>
                  <TabPanel className={"px-1 py-2 text-left text-sm"}>
                    Content 1
                  </TabPanel>
                  <TabPanel className={"px-1 py-2 text-left text-sm"}>
                    Content 2
                  </TabPanel>
                  <TabPanel className={"px-1 py-2 text-left text-sm"}>
                    Content 3
                  </TabPanel>
                </TabPanels>
              </div>
            </div>
          </TabGroup>
        </div>
      </div>
      <Footer disabledButton="hide" />
    </Transition>
  );
}
