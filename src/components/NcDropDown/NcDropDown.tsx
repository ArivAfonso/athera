"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import React, { FC, Fragment, ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";

export interface NcDropDownItem {
  id: string;
  name: string;
  icon: string;
}

export interface NcDropDownProps {
  className?: string;
  panelMenusClass?: string;
  triggerIconClass?: string;
  data: NcDropDownItem[];
  renderTrigger?: () => ReactNode;
  renderItem?: (item: NcDropDownItem) => JSX.Element;
  title?: string;
  onClick: (item: NcDropDownItem) => void;
}

const NcDropDown: FC<NcDropDownProps> = ({
  className = `h-8 w-8 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center }`,
  triggerIconClass = "h-6 w-6",
  panelMenusClass = "origin-top-right",
  title = "More",
  renderTrigger,
  renderItem,
  data,
  onClick,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={className} title={title}>
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <EllipsisHorizontalIcon className={triggerIconClass} />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${panelMenusClass} right-0 w-56 mt-2 bg-white dark:bg-neutral-900 rounded-2xl divide-y divide-neutral-100 shadow-lg ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 focus:outline-none z-30`}
        >
          <div className="px-1 py-3 text-sm text-neutral-6000 dark:text-neutral-300">
            {data.map((item) => (
              <Menu.Item
                as={"div"}
                key={item.id}
                onClick={() => onClick(item)}
                data-menu-item-id={item.id}
              >
                {() =>
                  renderItem && typeof renderItem(item) !== "undefined" ? (
                    renderItem(item)
                  ) : (
                    <button
                      className={
                        "flex items-center rounded-xl w-full px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 truncate "
                      }
                    >
                      {!!item.icon && (
                        <div
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        ></div>
                        // <i className={`${item.icon} mr-1 w-7 text-base`}></i>
                      )}
                      <span className="ml-3">{item.name}</span>
                    </button>
                  )
                }
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NcDropDown;
