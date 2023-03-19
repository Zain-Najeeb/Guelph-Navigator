const axios = require('axios');

//Are you running the server on the same machine? If so, Use this Link:
//http://127.0.0.1:3000/{api_endpoint}
//Other wise, use http://localhost:3000/{api_endpoint} 
axios.get("http://127.0.0.1:3000/API/Locations_new/Get")
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.error(error);
});