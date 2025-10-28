import { Outlet } from "react-router-dom";
import { useAppContext } from "../context/appContext";

function LoginRegister() {
  const { setIsLoginModal } = useAppContext();

  return (
    <div>
      <div className="h-[80px] w-full flex flex-row items-center justify-between px-3">
        <div className="flex flex-row gap-1 md:gap-5 h-full items-center">
          <div className="logo-header h-full w-[100px] md:w-[150px]"></div>
          <p className="text-[12px] md:text-[16px] text-black font-[700] cursor-pointer">
            Khám phá
          </p>
        </div>
        <div className="flex flex-row items-center justify-center gap-5">
          <div className="hidden md:flex flex-row gap-5 text-[16px] font-[500] text-[#215D82]">
            <a href="#">Giới thiệu</a>
            <a href="#">Doanh nghiệp</a>
            <a href="#">Tạo</a>
            <a href="#">Tin tức</a>
          </div>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => setIsLoginModal(true)}
              className="h-[38px]  md:h-[48px] w-[102px] md:w-[112px] btn-red rounded-xl md:rounded-2xl text-white text-[13px] md:text-[16px] font-[500] cursor-pointer"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLoginModal(false)}
              className="h-[38px]  md:h-[48px] w-[82px] md:w-[92px] bg-[#e0e0d9] hover:bg-[#cdcdc1] rounded-xl md:rounded-2xl text-black text-[13px] md:text-[16px] font-[500] cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default LoginRegister;
