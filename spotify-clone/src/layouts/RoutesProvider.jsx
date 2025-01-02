import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import DisplayHome from "./DisplayHome";
// import DisplayAlbum from "./DisplayAlbum";
import { useContext } from "react";
import { PlayerContext } from "@context/PlayerContext";
import Home from "@pages/Home";
import Album from "@pages/Album";
import SearchView from "@pages/SearchView";
// import { albumsData } from '../assets/assets'

const RoutesProvider = () => {
    const { albumsData } = useContext(PlayerContext);

    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes("album");
    const albumId = isAlbum ? location.pathname.split("/").pop() : "";
    const bgColor = isAlbum
        ? albumsData.find((x) => x._id == albumId).bgColour
        : "#121212";

    useEffect(() => {
        if (isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor},#121212)`;
        } else {
            displayRef.current.style.background = `#121212`;
        }
    });

    return (
        <div
            ref={displayRef}
            className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
        >
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/album/:id"
                    element={
                        <Album
                            album={albumsData.find((x) => x._id == albumId)}
                        />
                    }
                />
                <Route path="/search" element={<SearchView />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </div>
    );
};

export default RoutesProvider;
