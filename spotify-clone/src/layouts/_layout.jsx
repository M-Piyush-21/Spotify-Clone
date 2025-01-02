import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import Player from "@components/Player";

const _layout = ({ children }) => {
    const { loading } = useContext(PlayerContext);

    if (loading) {
        return (
            <div className="h-screen bg-black text-white flex items-center justify-center">
                <div className="text-xl">Loading Spotify...</div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white relative">
            <div className="h-full pb-20 flex"> 
                <Sidebar />
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
            
            <Player />
        </div>
    );
};

export default _layout;
