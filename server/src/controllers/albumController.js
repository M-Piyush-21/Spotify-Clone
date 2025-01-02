import { v2 as cloudinary } from 'cloudinary'
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
    try {
        const { name, desc, bgColour } = req.body;
        
        // Validate required fields
        if (!name || !desc || !bgColour) {
            return res.status(400).json({
                success: false,
                message: "Name, description and background color are required"
            });
        }

        // Check if image file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        console.log('Uploading image to Cloudinary...');
        const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "image",
            folder: "spotify/albums"
        });

        console.log('Creating album in database...');
        const albumData = {
            name,
            desc,
            bgColour,
            image: imageUpload.secure_url,
        };

        const album = new albumModel(albumData);
        await album.save();

        res.status(201).json({
            success: true,
            message: "Album added successfully",
            album
        });
    } catch (error) {
        console.error('Error adding album:', error);
        res.status(500).json({
            success: false,
            message: "Error adding album",
            error: error.message
        });
    }
};

const listAlbum = async (req, res) => {
    try {
        const albums = await albumModel.find({}).sort({ createdAt: -1 });
        console.log('Found albums:', albums.length);
        
        res.json({
            success: true,
            albums
        });
    } catch (error) {
        console.error('Error listing albums:', error);
        res.status(500).json({
            success: false,
            message: "Error listing albums",
            error: error.message
        });
    }
};

const removeAlbum = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Album ID is required"
            });
        }

        const album = await albumModel.findById(id);
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        // Delete the album
        await albumModel.findByIdAndDelete(id);

        // TODO: Also delete the image from Cloudinary
        // const publicId = album.image.split('/').pop().split('.')[0];
        // await cloudinary.uploader.destroy(publicId);

        res.json({
            success: true,
            message: "Album removed successfully"
        });
    } catch (error) {
        console.error('Error removing album:', error);
        res.status(500).json({
            success: false,
            message: "Error removing album",
            error: error.message
        });
    }
};

export { addAlbum, listAlbum, removeAlbum };