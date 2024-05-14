import { db } from "../utils/db.server";

export interface Community {
  id: number;
  title: string;
}

export const listCommunity = async (): Promise<{
  status: boolean;
  data: Community[];
}> => {
  try {
    const communityList = await db.community.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    return { status: true, data: communityList };
  } catch (error) {
    console.error("Error listing community:", error);
    throw new Error("Failed to fetch community");
  }
};
