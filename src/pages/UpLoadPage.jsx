import { ImageUp } from "lucide-react";
import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { insertPinAPI, uploaImgAPI } from "../services/api.services";
import { Await } from "react-router-dom";
import { useAuthContex } from "../context/AuthContext";

function UpLoadPage() {
  const [urlImgDemo, setUrlImgDemo] = useState();
  const [file, setFile] = useState();
  const descriptionRef = useRef();
  const TitleRef = useRef();
  const { userID } = useAuthContex();

  const handelClick = async () => {
    if (TitleRef.current.value && file && descriptionRef.current.value) {
      const title = TitleRef.current.value;
      const description = descriptionRef.current.value;

      //sử lý tên không có kí hiệu đặc biêt
      const fileN = `${Date.now()}_${file.name}`;
      const fileName = sanitizeFileName(fileN);
      function sanitizeFileName(fileName) {
        return fileName.normalize("NFD").replace(/[^a-zA-Z0-9._-]/g, "_");
      }

      try {
        const res = await uploaImgAPI("pins", file, fileName);
        if (res.Key) {
          const urlImg = `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/object/public/${res.Key}`;

          const UID = userID;
          const data = {
            user_id: UID,
            title: title,
            description: description,
            image_url: urlImg,
          };

          const insertPin = await insertPinAPI(data);
          if (insertPin) {
            toast.success("Đăng ảnh thànhc ông 👌");
          }
        }
      } catch (error) {
        toast.error("Đăng ảnh thất bại, vui lòng thử lại sau");
        console.log(error);
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin trước khi đăng ảnh");
    }
  };

  const showImgDemo = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      if (file) {
        setUrlImgDemo(() => URL.createObjectURL(file));
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-[72px] flex items-center justify-between px-5 border-t-1 border-b-1 border-[#e5e5e0]">
        <h2 className="font-[700] text-[20px] text-black">Thêm ảnh mới</h2>
        <button
          onClick={handelClick}
          className="p-3 px-4 btn-red rounded-2xl text-white font-bold cursor-pointer"
        >
          Đăng
        </button>
      </div>
      <div className="w-full flex lg:flex-row flex-col items-center justify-center">
        <div className="lg:w-[45%] w-full p-5 md:px-45 px-5 lg:px-20 ">
          <label htmlFor="upImg" className="cursor-pointer">
            {urlImgDemo ? (
              <img src={urlImgDemo} alt="" className="rounded-2xl" />
            ) : (
              <div className="h-[450px] p-10 w-full bg-color flex flex-col items-center justify-between rounded-4xl border-dashed border-2 boder-color cursor-pointer">
                <div className="flex items-center justify-center mt-40 flex-col gap-5">
                  <ImageUp className="size-10" />
                  <p className="text-[17px] font-[500] text-[#211922]">
                    Chọn 1 file ảnh ở đay
                  </p>
                </div>
                <p className="text-[14px] font-[500] text-[#211922]">
                  Chỉ có thể nhận các file ảnh{" "}
                </p>
              </div>
            )}
          </label>
          <input
            onChange={showImgDemo}
            accept="image/*"
            className="hidden"
            id="upImg"
            type="file"
          />
        </div>
        <div className=" lg:w-[55%] w-full md:p-10 p-5 flex flex-col items-center justify-between gap-5">
          <div className=" w-full flex flex-col gap-3">
            <label className="text-[13px]" htmlFor="tieuDe">
              Tiêu đề
            </label>
            <input
              ref={TitleRef}
              className="w-full bg-color px-5 rounded-2xl h-[70px] "
              type="text"
              id="tieuDe"
              placeholder="Thêm tiêu đề"
            />
          </div>
          <div className=" w-full flex flex-col gap-3">
            <label className="text-[13px]" htmlFor="moTa">
              Mô tả
            </label>
            <textarea
              ref={descriptionRef}
              className="w-full bg-color px-5 py-3 rounded-2xl h-[120px] outline-none"
              id="moTa"
              placeholder="Thêm mô tả chi tiết"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpLoadPage;
