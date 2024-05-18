import { db } from "../utils/db.server";

export interface Astrology {
  id: number;
  title: string;
}

export const listAstrology = async (): Promise<{
  status: boolean;
  data: Astrology[];
}> => {
  try {
    const astrologies = await db.astrology.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: astrologies };
  } catch (error) {
    // Handle errors here if needed
    console.error("Error listing astrologies:", error);
    throw new Error("Failed to fetch astrologies");
  }
};
