import {  createClient } from "redis";


const client = createClient()

client.on('error',(err)=>{console.log( "Redis connection error"
)})



async function startWorker(){

    try {
        await client.connect()
        console.log("Worker Connected to Redis")

        while(true){
            const response = await client.rPop('problems')
            if (!response) {
                await new Promise((r) => setTimeout(r, 1000));
                continue;
            }
            
            let parsedResponse= JSON.parse(response)
            console.log(parsedResponse.code) 
        }

    } catch (error) {
        console.log(`error in coonecting to redis ${error}`)
    }
}



startWorker()