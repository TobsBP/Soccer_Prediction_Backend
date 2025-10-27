import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTeams(){
  try {
    const data = await prisma.team.findMany();

    return data;
  } catch (error) {
    
    console.log("Can't reach the matches:", error);
  }
}
