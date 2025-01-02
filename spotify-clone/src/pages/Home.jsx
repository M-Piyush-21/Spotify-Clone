import React from "react";
import Navbar from "@layouts/Navbar";
import AlbumItem from "@components/ui/AlbumItem";
import SongItem from "@components/ui/SongItem";
import { useContext } from "react";
import { PlayerContext } from "@context/PlayerContext";
import ItemsRow from "@components/ItemsRow";

const DisplayHome = () => {
    const { songsData, albumsData } = useContext(PlayerContext);

    const itemRowsData = [
        {
            data: albumsData,
            Element: AlbumItem,
            title: "Featured Charts",
        },
        {
            data: songsData,
            Element: SongItem,
            title: "Today's biggest hits",
        },
    ];

    return (
        <>
            <Navbar />

            {itemRowsData.map((item, index) => (
                <ItemsRow key={index} {...item} />
            ))}
        </>
    );
};

export default DisplayHome;
