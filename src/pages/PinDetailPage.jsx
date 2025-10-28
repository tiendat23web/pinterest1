import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addLikeAPI,
  countLikeAPI,
  deleteLikeAPI,
  getLikedAPI,
  getLinkDowImgAPI,
  getPinDetailAPI,
  getPinsAPI,
} from "../services/api.services";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuthContex } from "../context/AuthContext";
import toast from "react-hot-toast";
import Loading from "../component/Loading";
import { useInfiniteQuery } from "@tanstack/react-query";

export const PinDetailPage = () => {
  const [pinDetail, setPinDetail] = useState();
  const [leftPins, setLeftPins] = useState();
  const [rightPins, setRightPins] = useState();
  const [like, setLike] = useState();
  const [countLike, setCountLike] = useState();
  const id = useParams();
  const { userID } = useAuthContex();
  const bottemRef = useRef();
  const LIMIT = 20;
  const navigate = useNavigate();
  const location = useLocation();
  const backLink = location.state?.from || "/";

  const handleClick = (id) => {
    navigate(`/pin/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownloadImage = async () => {
    if (!pinDetail?.image_url) return;

    try {
      const response = await getLinkDowImgAPI(pinDetail.image_url);

      const blob = new Blob([response], {
        type: "image/jpeg",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = (pinDetail?.title || "image") + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["pins", "related", id.id],
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * LIMIT;
        const to = from + LIMIT - 1;
        return await getPinsAPI(from, to, id.id);
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === LIMIT ? pages.length : undefined,
    });

  const getPin = async () => {
    const res = await getPinDetailAPI(id.id);
    if (res) {
      setPinDetail(res[0]);
    }
  };

  const getLike = async () => {
    const res = await getLikedAPI(pinDetail.id, userID);
    if (res) {
      setLike(res.length > 0);
    }
  };

  const getCountLink = async () => {
    const count = await countLikeAPI(pinDetail.id);
    setCountLike(count.length);
  };

  const handelClickLike = async () => {
    const likeRef = like;
    if (!likeRef) {
      try {
        await addLikeAPI(pinDetail.id, userID);
        setLike(true);
        setCountLike((pres) => pres + 1);
        toast.success("Đã tim ảnh 💖");
      } catch (error) {
        setLike(likeRef);
        toast.error("Tim ảnh thất bại");
      }
    }
    if (likeRef) {
      try {
        await deleteLikeAPI(pinDetail.id, userID);
        setLike(false);
        setCountLike((pres) => pres - 1);
        toast.success("Đã bỏ tim 💔");
      } catch (error) {
        setLike(likeRef);
        toast.error("Bỏ tim thất bại");
      }
    }
  };

  useLayoutEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (bottemRef.current) observer.observe(bottemRef.current);

    const allPins = data?.pages.flat() || [];
    const total = allPins.length;

    const leftSize = Math.floor(total * 0.5);
    const left = allPins.slice(0, leftSize);
    const right = allPins.slice(leftSize);

    setLeftPins(left);
    setRightPins(right);

    return () => observer.disconnect();
  }, [id.id, data]);

  useEffect(() => {
    if (pinDetail && userID) {
      getLike();
      getCountLink();
    }
  }, [pinDetail, userID]);
  useEffect(() => {
    getPin();
  }, [id]);

  return (
    <div className="w-full md:px-20 px-5 relative">
      <div
        onClick={() => navigate(backLink)}
        className="absolute hidden md:block top-0 left-2 bg-color p-3 px-5 rounded-2xl cursor-pointer"
      >
        <ArrowLeft />
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        <div className="col-span-1">
          {/* main detail */}
          <div className="w-full border-1 boder-color rounded-2xl p-5 flex flex-col gap-5 mb-5">
            <div className="w-full h-[48px] flex items-center justify-between">
              <div className="flex gap-2">
                <Heart
                  onClick={handelClickLike}
                  className={`cursor-pointer ${like ? "text-red-600" : ""}`}
                />
                <p className="font-bold">{countLike}</p>
              </div>
              <div
                onClick={handleDownloadImage}
                className="p-3 px-5 btn-red rounded-2xl cursor-pointer text-white font-bold"
              >
                <p>lưu</p>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full">
                <img
                  className="object-contain mx-auto max-h-[80vh] rounded-2xl"
                  src={pinDetail?.image_url}
                  alt={pinDetail?.description}
                />
              </div>
            </div>
            <div className=" w-full flex flex-col items-start justify-center gap-3">
              <div>
                <p className="font-bold text-[20px]">{pinDetail?.title}</p>
                <p className="text-[14px]">{pinDetail?.description}</p>
              </div>
              <div className="h-[1px] w-full bg-[#dadada]"></div>
              <Link
                to={`/userDetail/${pinDetail?.profile.id}`}
                className="flex gap-2 items-center"
              >
                <img
                  src={pinDetail?.profile.avatar_url}
                  alt={pinDetail?.profile.full_name}
                  className="rounded-full object-cover size-8"
                />
                <p className="font-[500]">{pinDetail?.profile.full_name}</p>
              </Link>
            </div>
          </div>

          <div className="2xl:columns-3 columns-2 hidden md:block">
            {leftPins &&
              leftPins.map((pin) => {
                return (
                  <div
                    key={pin.id}
                    className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
                  >
                    <div onClick={() => handleClick(pin.id)}>
                      <div className="group-hover:flex hidden cursor-pointer absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent p-5 flex-col items-start justify-end">
                        <p className="text-white font-bold">{pin.title}</p>
                        <p className="text-white">{pin.description}</p>
                      </div>
                      <img src={pin.image_url} alt={pin.title} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-span-1">
          <div className="columns-2 2xl:columns-3">
            {rightPins &&
              rightPins.map((pin) => {
                return (
                  <div
                    key={pin.id}
                    className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
                  >
                    <div onClick={() => handleClick(pin.id)}>
                      <div className="group-hover:flex hidden cursor-pointer absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent p-5 flex-col items-start justify-end">
                        <p className="text-white font-bold">{pin.title}</p>
                        <p className="text-white">{pin.description}</p>
                      </div>
                      <img src={pin.image_url} alt={pin.title} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div ref={bottemRef} className=" mx-auto w-full flex justify-center">
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && "đã hết ảnh"}
      </div>
    </div>
  );
};
