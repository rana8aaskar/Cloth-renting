import mongoose from 'mongoose'


const ConnectDB = async() =>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/Cloth_renting`)
        console.log(`\n MONGO_DB Connected !! DB HOST: ${connectionInstance.connection.host} \n`);
        
    } catch (error) {
        console.log("Error: ", error);
        process.exit(1)
        
    }
}

export default ConnectDB