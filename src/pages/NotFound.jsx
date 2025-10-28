import Lottie from "lottie-react";
import React from "react";
import animation from "../accset/animation/Page Not Found 404.json";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-full h-screen flex items-center justify-center ">
      <Lottie
        animationData={animation}
        loop={true}
        autoplay={true}
        className="w-[70%]"
      />
      <Link to="/">
        <button className=" cursor-pointer p-3 bg-blue-500 hover:bg-blue-600 rounded-2xl">
          Quay về trang chủ
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
