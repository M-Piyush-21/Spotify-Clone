import React from "react";
import { assets } from "@assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="bg-[#e7e7e7] min-h-screen pl-[4vw]">
            <div className="flex flex-col gap-5 mt-10">
                <NavLink
                    to="http://localhost:5174/"
                    className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium"
                >
                    <img className="w-5" src={assets.home_icon} alt="" />
                    <p className="hidden sm:block">Home</p>
                </NavLink>

                <NavLink
                    to="/add-song"
                    className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium"
                >
                    <img className="w-5" src={assets.add_song} alt="" />
                    <p className="hidden sm:block">Add Song</p>
                </NavLink>

                <NavLink
                    to="/list-songs"
                    className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium"
                >
                    <img className="w-5" src={assets.song_icon} alt="" />
                    <p className="hidden sm:block">List Songs</p>
                </NavLink>

                <NavLink
                    to="/add-album"
                    className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium"
                >
                    <img className="w-5" src={assets.add_album} alt="" />
                    <p className="hidden sm:block">Add Album</p>
                </NavLink>

                <NavLink
                    to="/list-albums"
                    className="flex items-center gap-2.5 text-gray-800 bg-white border border-black p-2 pr-[max(8vw,10px)] drop-shadow-[-4px_4px_#00FF5B] text-sm font-medium"
                >
                    <img className="w-5" src={assets.album_icon} alt="" />
                    <p className="hidden sm:block">List Album</p>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
