import { db } from "../utils/db.server";

export interface MaritalStatus {
  id: number;
  title: string;
}

export const listMatrimonialStatus = async (): Promise<{
  status: boolean;
  data: MaritalStatus[];
}> => {
  try {
    const matrimonialStatusList = await db.maritalStatus.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: matrimonialStatusList };
  } catch (error) {
    // Handle errors here if needed
    return { status: false, data: [] }; // Return an empty array if an error occurs
  }
};
