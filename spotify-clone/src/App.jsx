import React, { useContext } from "react";

import RoutesProvider from "@layouts/RoutesProvider";
import { PlayerContext } from "@context/PlayerContext";
import _layout from "@layouts/_layout";

const App = () => {
    const { audioRef, track, songsData } = useContext(PlayerContext);

    return (
        <>
            <_layout>
                <RoutesProvider />
            </_layout>
        </>
    );
};

export default App;
