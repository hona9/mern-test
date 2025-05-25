import mongoose from "mongoose";

const connectDB = async () => { 
  mongoose.connect(`${process.env.MONGODB_URI}/trendify`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

};

export default connectDB;
