import dbFunction from "../db/submissions.js";
import runCode from "../executor/dockerExecutor.js";
import client from "./redisClient.js";



async function workerLoop() {
  while (true) {
    const response = await client.blPop("problems", 0);
    if (!response) continue;

    const { id, code, lang , input} = JSON.parse(response.element);
    try {
      const data = await runCode(code, lang, id,input);
      await dbFunction(id, data as any);
    } catch (err) {
      console.error(`Job ${id} failed:`, err);

      try {
        await dbFunction(id, {
          success: false,
          error: err instanceof Error ? err.message : String(err),
          output: "",
        });
      } catch (error) {
        console.error(`Job ${id} failed TO Save in DB :`, err);
      }
    }
  }
}


export default workerLoop