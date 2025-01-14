const mongoose = require('mongoose');

// Connect to MongoDB
 const connectDatabase = async () => {
    try {
        const connection = await mongoose.connect('mongodb://localhost:27017/GymManagement', {
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDatabase