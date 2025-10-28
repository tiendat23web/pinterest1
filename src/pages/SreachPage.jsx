import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { sreachAPI } from "../services/api.services";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../component/Loading";

function SreachPage() {
  const [sreachPararam] = useSearchParams();
  const loadMoreRef = useRef();

  const sreachValue = sreachPararam.get("q") || "";
  const LIMIT = 20;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["pinsSreach", sreachValue],
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * LIMIT;
        const to = from + LIMIT - 1;
        return await sreachAPI(from, to, sreachValue);
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === LIMIT ? pages.length : undefined,
    });

  useEffect(() => {
    if (!hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [sreachValue, data]);

  console.log(data);

  return (
    <>
      <div className="2xl:columns-7 xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 columns-2 gap-4 p-4 ">
        {data &&
          data?.pages.flat().map((pin) => {
            return (
              <div
                key={pin.id}
                className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
              >
                <Link
                  to={`/pin/${pin.id}`}
                  state={{ from: `/sreach?q=${sreachValue}` }}
                >
                  <div className="group-hover:flex hidden cursor-pointer absolute inset-0 bg-gradient-to-t from-gray-800/80 to-transparent p-5 flex-col items-start justify-end">
                    <p className="text-white font-bold">{pin.title}</p>
                    <p className="text-white">{pin.description}</p>
                  </div>
                  <img src={pin.image_url} alt={pin.title} />
                </Link>
              </div>
            );
          })}
      </div>
      <div
        ref={loadMoreRef}
        className="w-full flex items-center justify-center"
      >
        {isFetchingNextPage && <Loading />}
        {!hasNextPage && <p>Đã hết ảnh hoặc không tìm tháy ảnh 🚀</p>}
      </div>
    </>
  );
}

export default SreachPage;
