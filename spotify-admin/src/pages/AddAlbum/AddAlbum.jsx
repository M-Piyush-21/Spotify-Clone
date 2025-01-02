import React, { useState } from "react";
import { assets } from "@assets";
import { url } from "@/App";
import { toast } from "react-toastify";
import axios from "axios";

const AddAlbum = () => {
    const [image, setImage] = useState(null);
    const [colour, setColour] = useState("#000000");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!name.trim()) {
            toast.error("Album name is required");
            return false;
        }
        if (!desc.trim()) {
            toast.error("Album description is required");
            return false;
        }
        if (!image) {
            toast.error("Album image is required");
            return false;
        }
        if (!colour) {
            toast.error("Album background color is required");
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setName("");
        setDesc("");
        setImage(null);
        setColour("#000000");
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("desc", desc.trim());
            formData.append("image", image);
            formData.append("bgColour", colour);

            console.log('Submitting album data...');
            const response = await axios.post(`${url}/api/album/add`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success("Album added successfully");
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to add album");
            }
        } catch (error) {
            console.error('Error adding album:', error);
            toast.error(error.response?.data?.message || "Error occurred while adding album");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Image size should be less than 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("Please select an image file");
                return;
            }
            setImage(file);
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Add New Album</h2>
            
            {loading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
                </div>
            ) : (
                <form onSubmit={onSubmitHandler} className="max-w-2xl">
                    <div className="mb-6">
                        <label className="block mb-2">Album Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter album name"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2">Description</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter album description"
                            rows="4"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2">Background Color</label>
                        <input
                            type="color"
                            value={colour}
                            onChange={(e) => setColour(e.target.value)}
                            className="w-20 h-10"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2">Album Cover</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full"
                        />
                        {image && (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="mt-4 w-40 h-40 object-cover rounded"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                        disabled={loading}
                    >
                        Add Album
                    </button>
                </form>
            )}
        </div>
    );
};

export default AddAlbum;
