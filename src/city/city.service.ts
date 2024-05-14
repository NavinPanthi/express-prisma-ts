import { db } from "../utils/db.server";

export interface City {
  id: number;
  title: string;
}

export const listCity = async (): Promise<{
  status: boolean;
  data: City[];
}> => {
  try {
    const cityList = await db.city.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: cityList };
  } catch (error) {
    console.error("Error listing cities:", error);
    throw new Error("Failed to fetch cities");
  }
};
