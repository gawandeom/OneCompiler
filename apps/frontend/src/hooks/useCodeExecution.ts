import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function useCodeExecution (){
  const [submissionId, setSubmissionId] = useState(null);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async (code:string,language:string,input:string) => {
    setIsRunning(true);
    setOutput("Processing");

    try {
      const response = await axios.post("http://localhost:5000/execute", {
        code,
        lang:language,
        input
      });
      setSubmissionId(response.data.submissionId);
    } catch (error) {
      setOutput("Failed to submit code");
      setIsRunning(false);
    }
  }, []);


    useEffect( ()=>{

      if(!submissionId) return 
      let cancelled = false 

      let timeoutId:ReturnType<typeof setTimeout>;


    const poll = async()=>{
        try {

        const response = await axios.get(`http://localhost:5000/submission/${submissionId}`);

        if(cancelled) return

        const {status,output,error} = response.data.result

    if(status === "processing"){
      timeoutId = setTimeout(poll, 1000);
    }
    else{
      setOutput(status === "success"? output : error)
      setIsRunning(false)
    }
      
        
      } catch (error) {
        console.log('Error in getting output')
      }
    }
     poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };

    },[submissionId])


    return {output,runCode,isRunning}

}