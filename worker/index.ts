import {  createClient } from "redis";
import {spawn} from "node:child_process"
import fs from "fs"
import { prisma } from "./db.ts";
import { resolve } from "node:dns";
import { compileFunction } from "node:vm";

const client = createClient()

client.on('error',(err)=>{console.log( "Redis connection error"
)})



async function executor() {
  while(true){


            const response = await client.rPop('problems')

            if (!response) {
                await new Promise((r) => setTimeout(r, 1000));
                continue;
            }
            
            let parsedResponse= JSON.parse(response)
            let {id,code,lang} = parsedResponse
            let finalOutput = ""
            let finalError = ""




            
            if(lang==='js'){

                const filepath = __dirname + "/code/a.js"
                fs.writeFileSync(filepath,code)

                const CompilerResponse = spawn("node",[filepath])

                CompilerResponse.stdout.on("data",(chunk)=>{
                    finalOutput += chunk.toString();
                    
                    console.log(finalOutput)
                })

                 CompilerResponse.stderr.on("error",(error)=>{
                        finalError += error.toString();
                })

              await  new Promise<void>((resolve) =>{
                    
                CompilerResponse.on("exit",async(exitCode)=>{
                    if(exitCode === 0){
                        const res =   await prisma.sumission.update({
                        
                            where:{
                                id
                            },
                            data:{
                                status:"sucess",
                                error:"null",
                                output:finalOutput
                            }
                        })
                        console.log(res)

                    }else{

                        await prisma.sumission.update({
                            where:{
                                id
                            },
                            data:{
                                status:"failure",
                                error:finalError,
                                output:finalOutput
                            }
                        })

                    }
                })
                    
                    resolve()
                })
            

               

            }
        }  
} 























async function startWorker(){

    try {
        await client.connect().then()
        console.log("Worker Connected to Redis")

        
        executor()

    } catch (error) {
        console.log(`error in coonecting to redis ${error}`)
    }
}



startWorker()