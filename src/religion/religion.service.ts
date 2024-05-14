import { db } from "../utils/db.server";

export interface Religion {
  id: number;
  title: string;
}

export const listReligion = async (): Promise<{
  status: boolean;
  data: Religion[];
}> => {
  try {
    const religionList = await db.religion.findMany({
      select: {
        id: true,
        title: true,
      },
    });
    return { status: true, data: religionList };
  } catch (error) {
    console.error("Error listing religions:", error);
    throw new Error("Failed to fetch religions");
  }
};
