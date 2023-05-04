import React, { FC } from "react";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import dogPng from "@/images/dog.png";

export interface CardCategory3Props {
  className?: string;
}

const CardCategory3: FC<CardCategory3Props> = ({ className = "" }) => {
  return (
    <Link
      href={"/archive/demo-slug"}
      className={`nc-CardCategory3 block ${className}`}
    >
      <div
        className={`relative w-full aspect-w-16 aspect-h-11 sm:aspect-h-9 h-0 rounded-2xl overflow-hidden group bg-sky-100`}
      >
        <div>
          <div className="absolute inset-5 sm:inset-8">
            <Image
              alt="ads"
              src={dogPng}
              className="absolute right-0 w-1/2 max-w-[260px] h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
        <span className="opacity-0 group-hover:opacity-40 absolute inset-0 bg-black/10 transition-opacity"></span>

        <div>
          <div className="absolute inset-5 sm:inset-8 flex flex-col">
            <div className="max-w-xs">
              <span className={`block mb-2 text-sm text-slate-700`}>
                Sponsored
              </span>
              <h2
                className={`text-xl md:text-2xl text-slate-900 font-semibold`}
              >
                Up to <br /> 80% off retail
              </h2>
            </div>
            <div className="mt-auto">
              <ButtonPrimary
                sizeClass="py-3 px-4 sm:py-3.5 sm:px-6"
                fontSize="text-sm font-medium"
                className="nc-shadow-lg"
              >
                Show me more
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CardCategory3;
