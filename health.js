var client = require("./connection.js");

/* Get the health status */
const healthCheck = async function(){
	try{
		const healthStatus = await client.cluster.health({})
		return healthStatus
	}catch(error){
		return error
	}
	

}

// client.cluster.health({},function(err,resp,status) {  
//     console.log("-- Client Health --",resp);
//   });

module.exports = {
	healthCheck
}
