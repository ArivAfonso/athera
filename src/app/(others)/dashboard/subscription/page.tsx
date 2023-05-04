import React from "react";

const data = [
  { name: "Subcription Name", content: " Premium" },
  { name: "Package & billing details", content: " $222.00" },
  { name: "Remaining post", content: " 18" },
  { name: "Expire date", content: " October 20, 2021" },
];

const DashboardSubcription = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 dark:border dark:border-neutral-800 shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-neutral-900 dark:text-neutral-200">
          Package Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
          {`You've subscribed to the following package`}
        </p>
      </div>
      <div className="border-t border-neutral-200 dark:border-neutral-900">
        <dl>
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-neutral-50 dark:bg-neutral-800"
                    : "bg-white dark:bg-neutral-900"
                } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
              >
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-300">
                  {item.name}
                </dt>
                <dd className="mt-1 text-sm text-neutral-900 dark:text-neutral-200 font-medium sm:mt-0 sm:col-span-2">
                  {item.content}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
};

export default DashboardSubcription;
