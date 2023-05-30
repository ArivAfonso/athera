"use client";

import React, { FC } from "react";
import Heading from "@/components/Heading/Heading";
import { PostAuthorType } from "@/data/types";
import CardAuthorBox2 from "@/components/CardAuthorBox2/CardAuthorBox2";
import MySlider from "@/components/MySlider";

interface AuthorType {
  name: string;
    slug: {
            _type: string
            current: string
        };
    image: {
        asset: {
            _ref: string;
            _type: string;
        };
        _type: string;
    }
    count: number;
    username: string;
  }

export interface SectionSliderNewAuthorsProps {
  className?: string;
  heading: string;
  subHeading: string;
  authors: AuthorType[];
  itemPerRow?: number;
}

const SectionSliderNewAuthors: FC<SectionSliderNewAuthorsProps> = ({
  heading = "Suggestions for discovery",
  subHeading = "Popular places to recommends for you",
  className = "",
  authors,
  itemPerRow = 5,
}) => {
  return (
    <div className={`nc-SectionSliderNewAuthors ${className}`}>
      <Heading desc={subHeading} isCenter>
        {heading}
      </Heading>
      <MySlider
        itemPerRow={itemPerRow}
        data={authors}
        renderItem={(item, index) => (
          <CardAuthorBox2 key={index} author={item} />
        )}
      />
    </div>
  );
};

export default SectionSliderNewAuthors;
