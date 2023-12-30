 import axios from 'axios';
 export const getJson= () => {
  axios.get('http://localhost:5216/Spot/GetSpot', { params: { id: 1 } })
  .then(response => {
   console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
}
