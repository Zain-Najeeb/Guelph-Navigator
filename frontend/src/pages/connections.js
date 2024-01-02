//This file serves the purpose helping pages request information on the server..

import axios from 'axios';
import AWS from 'aws-sdk';

const aKey = process.env.S3_ACCESS_KEY; 
const pKey = process.env.S3_PRIVATE_KEY; 

AWS.config.update({
    region: 'ca-central-1', 
    credentials: new AWS.Credentials(aKey, pKey), 
})
export const getBuildings = async () => {
  
}
export const getSpot = async () => {
 await axios.get('http://localhost:5216/Spot/GetSpot', { params: { id: 1 } })
 .then(response => {
  console.log(response.data);
 })
 .catch(error => {
   console.error(error);
 });
}
export const getFastestPathPoints = async (start, end) => {
  try {
    const response = await axios.get('http://localhost:5216/Spot/GetFastestPathPoints', { params: { start, end } });
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const AWSinstance = new AWS.S3(); 