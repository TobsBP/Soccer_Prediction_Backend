import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getMatches(){
  try {
    const data = await prisma.match.findMany();

    return data;
  } catch (error) {
    
    console.log("Can't reach the matches:", error);
  }
}
