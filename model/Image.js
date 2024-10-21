import mongoose from 'mongoose';

// Define the schema for images
const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Automatically create `createdAt` and `updatedAt` fields

// Create a model from the schema
const Image = mongoose.model('Image', imageSchema);

export default Image;
