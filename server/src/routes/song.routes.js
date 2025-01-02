import { Router } from "express";
import {
    addSong,
    listSong,
    removeSong,
    searchSongs
} from "../controllers/songController.js";
import upload from "../middleware/multer.js";

const songRouter = Router();

// Add song route with file uploads
songRouter.post("/add", upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]), addSong);

// List all songs
songRouter.get("/list", listSong);

// Remove a song
songRouter.post("/remove", removeSong);

// Search songs
songRouter.get("/search/:query", searchSongs);

export default songRouter;
