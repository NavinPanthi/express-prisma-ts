import { db } from "../utils/db.server";

export interface MotherTongue {
  id: number;
  title: string;
}

export const listMotherTongue = async (): Promise<{
  status: boolean;
  data: MotherTongue[];
}> => {
  try {
    const motherTongueList = await db.motherTongue.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: motherTongueList };
  } catch (error) {
    console.error("Error listing mother tongues:", error);
    throw new Error("Failed to fetch mother tongues");
  }
};
