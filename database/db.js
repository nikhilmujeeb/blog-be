import mongoose from 'mongoose';

const Connection = async () => {
  const URL = process.env.DB;

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error while connecting to the database:', error.message);
    process.exit(1);
  }
};

export default Connection;
