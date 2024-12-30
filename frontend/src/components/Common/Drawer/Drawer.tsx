import React, { useState } from "react";

interface DrawerProps {
  children: React.ReactNode;
}

export default function Drawer({ children }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Button to open the drawer */}
      <button
        onClick={toggleDrawer}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Open Drawer
      </button>

      {/* Background backdrop, show/hide based on slide-over state */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity ease-in-out duration-500"
          aria-hidden="true"
        ></div>
      )}

      {/* Slide-over panel, show/hide based on slide-over state */}
      <div
        className={`fixed inset-0 overflow-hidden transition-transform duration-500 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto relative w-screen max-w-md">
              {/* Close button */}
              <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                <button
                  type="button"
                  onClick={toggleDrawer}
                  className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="absolute -inset-2.5"></span>
                  <span className="sr-only">Close panel</span>
                  <svg
                    className="size-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <h2
                    className="text-base font-semibold text-gray-900"
                    id="slide-over-title"
                  >
                    Panel title
                  </h2>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
