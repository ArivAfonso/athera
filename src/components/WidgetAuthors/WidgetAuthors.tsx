import CardAuthor from "@/components/CardAuthor/CardAuthor";
import WidgetHeading1 from "@/components/WidgetHeading1/WidgetHeading1";
import { DEMO_AUTHORS } from "@/data/authors";
import { PostAuthorType } from "@/data/types";
import React, { FC } from "react";

const authorsDemo: PostAuthorType[] = DEMO_AUTHORS.filter((_, i) => i < 5);

export interface WidgetAuthorsProps {
  className?: string;
  authors?: PostAuthorType[];
}

const WidgetAuthors: FC<WidgetAuthorsProps> = ({
  className = "bg-neutral-100 dark:bg-neutral-800",
  authors = authorsDemo,
}) => {
  return (
    <div
      className={`nc-WidgetAuthors rounded-3xl overflow-hidden ${className}`}
    >
      <WidgetHeading1
        title="🎭 Discover Authors"
        viewAll={{ label: "View all", href: "/#" }}
      />
      <div className="flow-root">
        <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700">
          {authors.map((author) => (
            <CardAuthor
              className="p-4 xl:p-5 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              key={author.id}
              author={author}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetAuthors;
