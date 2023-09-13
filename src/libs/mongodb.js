import mongoose from 'mongoose';

const connnectMongoDb = async () => {
  console.log('try to connect mongoose')
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongo connected!')
  } catch (error) {
    console.error(error);
  }
}

export default connnectMongoDb;