import mongoose from 'mongoose';

const connnectMongoDb = async () => {
  console.info('connecting to mongoDB')
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
}

export default connnectMongoDb;