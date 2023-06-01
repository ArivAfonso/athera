import ButtonPrimary from "@/components/Button/ButtonPrimary";
import React from "react";

const Page404: React.FC = () => (
  <div className="nc-Page404">
    <div className="flex justify-center">
    <h1>What on </h1>
    <span className="text-blue-500 bg-blue-100 dark:bg-blue-950 p-1 rounded-md">Earth</span>
    <h1> are you doing here!?</h1>
    <ButtonPrimary href="/" className="mt-4">
          Get Yourself Home
        </ButtonPrimary>
    </div>
  </div>
);

export default Page404;
