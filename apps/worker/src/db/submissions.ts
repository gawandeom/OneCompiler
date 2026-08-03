import { prisma } from "@onecompiler/db";




type dbResponse = {
  success: boolean;
  error: string;
  output: string;
};

 const dbFunction = async (id: string, data: dbResponse) => {
  const dbRes = await prisma.submission.update({
    where: { id },
    data: {
      status: data.success ? "sucess" : "failure",
      error: data.success ? "" : data.error,
      output: data.output,
    },
  });
};


export default dbFunction