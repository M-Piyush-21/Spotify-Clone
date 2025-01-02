import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
    try {
        // Validate required fields
        const { name, desc, album } = req.body;
        if (!name || !desc || !album) {
            return res.status(400).json({ 
                success: false,
                message: "Name, description and album are required" 
            });
        }

        // Check if files were uploaded
        if (!req.files || !req.files.audio || !req.files.image) {
            return res.status(400).json({ 
                success: false,
                message: "Both audio and image files are required" 
            });
        }

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        console.log('Uploading audio file to Cloudinary...');
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
            resource_type: "video",
        });

        console.log('Uploading image file to Cloudinary...');
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
            audioUpload.duration % 60,
        )}`;

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            url: audioUpload.secure_url,
            duration,
        };

        console.log('Creating song in database...');
        const song = songModel(songData);
        await song.save();

        res.status(201).json({ 
            success: true,
            message: "Song added successfully", 
            song 
        });
    } catch (error) {
        console.error('Error adding song:', error);
        res.status(500).json({ 
            success: false,
            message: "Error adding song",
            error: error.message 
        });
    }
};

const listSong = async (req, res) => {
    try {
        const songs = await songModel.find({});
        console.log('Songs found:', songs.length);
        const songsWithUrl = songs.map(song => ({
            ...song.toObject(),
            url: song.file 
        }));
        res.json({ 
            success: true,
            songs: songsWithUrl 
        });
    } catch (error) {
        console.error('Error listing songs:', error);
        res.status(500).json({ 
            success: false,
            message: "Error listing songs",
            error: error.message 
        });
    }
};

const removeSong = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "Song ID is required" 
            });
        }

        const song = await songModel.findByIdAndDelete(id);
        if (!song) {
            return res.status(404).json({ 
                success: false,
                message: "Song not found" 
            });
        }

        res.json({ 
            success: true,
            message: "Song removed successfully" 
        });
    } catch (error) {
        console.error('Error removing song:', error);
        res.status(500).json({ 
            success: false,
            message: "Error removing song",
            error: error.message 
        });
    }
};

const searchSongs = async (req, res) => {
    try {
        const { query } = req.params;
        
        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        console.log(`Searching for songs with query: "${query}"`);

        // Create a case-insensitive regex pattern
        const searchPattern = new RegExp(query.trim(), 'i');

        // Search in name and description fields
        const songs = await songModel.find({
            $or: [
                { name: searchPattern },
                { desc: searchPattern }
            ]
        }).select('name desc image file url duration album')
          .sort({ createdAt: -1 })
          .limit(20);

        console.log(`Found ${songs.length} songs matching "${query}"`);

        // Ensure all songs have a url field
        const songsWithUrl = songs.map(song => {
            const songObj = song.toObject();
            if (!songObj.url && songObj.file) {
                songObj.url = songObj.file;
            }
            return songObj;
        });

        res.json({
            success: true,
            songs: songsWithUrl
        });
    } catch (error) {
        console.error('Error searching songs:', error);
        res.status(500).json({
            success: false,
            message: "Error searching songs",
            error: error.message
        });
    }
};

export { addSong, listSong, removeSong, searchSongs };
