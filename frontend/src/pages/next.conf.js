//some werid file to process ENV files..


require("dotenv").config();
module.exports = {
    env: {
        S3_ACCESS_KEY: process.env.S3_ACCESS_KEY, 
        S3_PRIVATE_KEY:  process.env.S3_PRIVATE_KEY 
    }
}