import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    album: { type: String, required: true },
    image: { type: String, required: true },
    file: { type: String, required: true },
    url: { type: String }, // Will be populated from file field
    duration: { type: String, required: true },
})

// Add a pre-save middleware to ensure url is set
songSchema.pre('save', function(next) {
    if (!this.url) {
        this.url = this.file;
    }
    next();
});

const songModel = mongoose.models.song || mongoose.model("song", songSchema);

export default songModel;