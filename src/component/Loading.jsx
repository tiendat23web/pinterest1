import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import animation from "../accset/animation/Loading animation blue.json";
import React from "react";
import Lottie from "lottie-react";

function Loading() {
  return (
    <>
      <Lottie
        animationData={animation}
        loop={true}
        autoplay={true}
        className="w-[200px]"
      />
    </>
  );
}

export default Loading;
