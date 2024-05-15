import { db } from "../utils/db.server";
import { Community } from "../community/community.service";
import { Country } from "../country/country.service";
import { City } from "../city/city.service";
import { Religion } from "../religion/religion.service";
import { MotherTongue } from "../motherTongue/motherTongue.service";
import { MaritalStatus } from "../maritalStatus/maritalStatus.service";
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: Date;
  gender: string;
  bio: string;
  image: string;
}
interface UserWrite extends User {
  religionId: number;
  cityId: number;
  countryId: number;
  motherTongueId: number;
  communityId: number;
  maritalStatusId: number;
}
interface Diversity {
  country: Country | null;
  city: City | null;
  religion: Religion | null;
  motherTongue: MotherTongue | null;
  community: Community | null;
}
interface UserRead extends User {
  diversity: Diversity | null;
  maritalStatus: MaritalStatus | null;
}
type UserLogin = {
  email: string;
  password: string;
};

export const createUser = async (
  user: Omit<UserWrite, "id">
): Promise<{
  status: boolean;
  data: UserRead;
}> => {
  const {
    email,
    firstName,
    lastName,
    password,
    dateOfBirth,
    gender,
    bio,
    image,
    maritalStatusId,
    religionId,
    cityId,
    countryId,
    motherTongueId,
    communityId,
  } = user;
  const parsedDate: Date = new Date(dateOfBirth);
  try {
    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        dateOfBirth: parsedDate,
        gender,
        bio,
        image,
        maritalStatusId,
        diversity: {
          create: {
            religionId,
            cityId,
            countryId,
            motherTongueId,
            communityId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        image: true,
        maritalStatus: {
          select: { id: true, title: true },
        },
        diversity: {
          select: {
            religion: {
              select: { id: true, title: true },
            },
            city: {
              select: { id: true, title: true },
            },
            country: {
              select: { id: true, title: true },
            },
            motherTongue: {
              select: { id: true, title: true },
            },
            community: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });
    return { status: true, data: newUser };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const loginUser = async (
  user: UserLogin
): Promise<{
  status: boolean;
  data: UserRead | null;
}> => {
  //   const { email, firstName, lastName, password } = user;
  const { email } = user;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        image: true,
        maritalStatus: {
          select: { id: true, title: true },
        },
        diversity: {
          select: {
            religion: {
              select: { id: true, title: true },
            },
            city: {
              select: { id: true, title: true },
            },
            country: {
              select: { id: true, title: true },
            },
            motherTongue: {
              select: { id: true, title: true },
            },
            community: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    return { status: true, data: existingUser };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { status: false, data: null };
  }
};

export const listUsers = async (): Promise<{
  status: boolean;
  data: User[];
}> => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        image: true,
        maritalStatusId: true,
      },
    });

    return { status: true, data: users };
  } catch (error) {
    // Handle errors here if needed
    return { status: false, data: [] }; // Return an empty array if an error occurs
  }
};
export const getUser = async (
  id: number
): Promise<{ status: boolean; data: User | null }> => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        image: true,
      },
    });

    return { status: true, data: user };
  } catch (error) {
    // Handle errors here if needed
    return { status: false, data: null }; // Return null if an error occurs
  }
};

export const updateUser = async (
  userId: number,
  data: Partial<User>
): Promise<{ status: boolean; message: string; data: User | null }> => {
  try {
    console.log("updating user", userId, data);
    const updatedUser = await db.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        image: true,
      },
    });

    return {
      status: true,
      message: `User with id ${userId} updated successfully`,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      status: false,
      message: `User with id ${userId} not updated`,
      data: null,
    };
  }
};

export const resetPassword = async (
  email: string,
  newPassword: string
): Promise<{ status: boolean; data: string }> => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { status: false, data: "User not found" };
    }

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newPassword,
      },
    });
    return { status: true, data: "Password reset successfully" };
  } catch (error) {
    return { status: false, data: "Error resetting password" };
  }
};

// service for deleting users
export const deleteUsers = async (): Promise<void> => {
  await db.user.deleteMany({});
};
