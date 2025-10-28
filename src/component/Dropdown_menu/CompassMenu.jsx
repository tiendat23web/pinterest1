import React from "react";

function CompassMenu({ className }) {
  return (
    <div
      className={`absolute shadow-2xl hidden group-hover:flex whitespace-nowrap flex-col p-5 bg-white rounded-2xl items-start w-[200px] ${className}`}
    >
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Nghệ thuật
      </div>
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Làm đẹp
      </div>
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Ẩm thực
      </div>
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Trang trí
      </div>
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Thời trang nữ
      </div>
      <div className="hover:bg-[#e5e5e5] px-3 rounded-xl w-full py-2 text-black font-[500]">
        Thời trang nam
      </div>
    </div>
  );
}

export default CompassMenu;
