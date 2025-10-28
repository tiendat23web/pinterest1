import { useEffect, useRef, useState } from "react";
import { useAuthContex } from "../context/AuthContext";
import { getPinsAPI } from "../services/api.services";
import { Link } from "react-router-dom";
import Loading from "../component/Loading";
import { useInfiniteQuery } from "@tanstack/react-query";
function HomePage() {
  const LIMIT = 20;
  const loadMoreRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["pins"],
      queryFn: async ({ pageParam = 0 }) => {
        const from = pageParam * LIMIT;
        const to = from + LIMIT - 1;
        return await getPinsAPI(from, to);
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
  }, [hasNextPage, fetchNextPage]);

  const pinsValue = data?.pages.flat();

  return (
    <>
      <div className="2xl:columns-7 xl:columns-5 lg:columns-4 md:columns-3 sm:columns-2 columns-2 gap-4 p-4 ">
        {pinsValue &&
          pinsValue.map((pin) => {
            return (
              <div
                key={pin.id}
                className=" mb-4 break-inside-avoid rounded-xl shadow-md overflow-hidden relative group"
              >
                <Link to={`pin/${pin.id}`}>
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
        {!hasNextPage && <p>Đã hết ảnh 🚀</p>}
      </div>
    </>
  );
}

export default HomePage;
