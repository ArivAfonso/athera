import React, { ReactNode } from "react";
import SingleContent from "../SingleContent";
import SingleRelatedPosts from "../SingleRelatedPosts";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {children}

      {/* SINGLE MAIN CONTENT */}
      <div className="container mt-10">
        <SingleContent />
      </div>

      {/* RELATED POSTS */}
      <SingleRelatedPosts />
    </div>
  );
};

export default layout;
