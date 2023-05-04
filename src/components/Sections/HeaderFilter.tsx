"use client";

import React, { FC, useState } from "react";
import Heading from "@/components/Heading/Heading";
import Nav from "@/components/Nav/Nav";
import NavItem from "@/components/NavItem/NavItem";
import Button from "../Button/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export interface HeaderFilterProps {
  tabs?: string[];
  heading: string;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabs = ["All items", "Garden", "Fitness", "Design"],
  heading = "🎈 Latest Articles",
}) => {
  const [tabActive, setTabActive] = useState<string>(tabs[0]);

  const handleClickTab = (item: string) => {
    if (item === tabActive) {
      return;
    }
    setTabActive(item);
  };

  return (
    <div className="flex flex-col mb-8 relative">
      <Heading>{heading}</Heading>
      <div className="flex justify-between">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base"
        >
          {tabs.map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActive === item}
              onClick={() => handleClickTab(item)}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        <Button className="!hidden md:!flex" pattern="white" sizeClass="px-6">
          <span>View all</span>
          <ArrowRightIcon className="ml-3 w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default HeaderFilter;
