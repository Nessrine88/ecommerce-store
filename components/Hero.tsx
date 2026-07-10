import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <div className="h-full py-10 max-w-7xl mx-auto flex  justify-center items-center p-4 md:gap-28  ">
      <div className="h-full flex items-center max-w-1/2 ">
        <div>
          <h1 className="font-bold italic text-[clamp(1vw,38px,8vw)] md:text-left w-full  text-accent">
            Our top sellings
          </h1>
          <p className="md:max-w-3/4 w-full  md:mt-5 text-muted text-[clamp(0.5vw,24px,3vw)]">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam
            animi quibusdam fuga sint veritatis error omnis? Voluptate,
            consequatur dolorum delectus perferendis saepe itaque maiores
            doloribus velit culpa assumenda, ullam architecto!
          </p>
        </div>
      </div>
      <div className="relative w-full h-auto ">
        <Image
          src="/plant1.png"
          width={500}
          height={500}
          alt="side Image"
          className=" relative z-20"
        />
        <div className="w-full  h-full  absolute bg-amber-50/10 rounded-full top-0  blur-2xl ">
          <div className="w-1/2 mx-auto translate-x-1/2 h-10 bg-black shadow-2xl z-50 border-black  border-2  absolute bottom-0 "></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
