import React, { useState } from "react";
import Navbar from "@layouts/Navbar";
import axios from "axios";
import SongItem from "@components/ui/SongItem";
import { assets } from "@assets";

const BASE_URL = "http://localhost:8000";

const SearchView = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Searching for:', searchQuery);
            const response = await axios.get(`${BASE_URL}/api/song/search/${encodeURIComponent(searchQuery.trim())}`);
            console.log('Search response:', response.data);

            if (response.data.success) {
                setResults(response.data.songs || []);
            } else {
                setError(response.data.message || 'Search failed');
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setError(error.response?.data?.message || 'Error searching songs');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Debounce function to prevent too many API calls
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Create a debounced version of handleSearch
    const debouncedSearch = React.useCallback(
        debounce((value) => handleSearch(value), 300),
        []
    );

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        debouncedSearch(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(query);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1F1F1F] to-[#121212]">
            <Navbar />
            
            <div className="p-6">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="relative mb-8">
                        <input
                            type="text"
                            placeholder="What do you want to listen to?"
                            value={query}
                            onChange={handleInputChange}
                            className="w-full px-12 py-3 bg-[#242424] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <img
                            src={assets.search_icon}
                            alt="Search"
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70"
                        />
                    </form>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-400">
                            <p>{error}</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-white">Search Results</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {results.map((song) => (
                                    <SongItem 
                                        key={song._id} 
                                        data={{
                                            ...song,
                                            url: song.file || song.url
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>
                    ) : query ? (
                        <div className="text-center py-8 text-gray-400">
                            <p>No results found for "{query}"</p>
                            <p className="mt-2">Try searching for something else</p>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <p>Start typing to search for songs</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchView;
