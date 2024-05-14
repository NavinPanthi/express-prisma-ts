import { db } from "../utils/db.server";

export interface Country {
  id: number;
  title: string;
}

export const listCountry = async (): Promise<{
  status: boolean;
  data: Country[];
}> => {
  try {
    const countries = await db.country.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: countries };
  } catch (error) {
    // Handle errors here if needed
    console.error("Error listing countries:", error);
    throw new Error("Failed to fetch countries");
  }
};
