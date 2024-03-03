import { User } from "./types";

export type MessageResponse = {
    success: boolean,
    message: string
}

export type CustomError = {
  status: number;
  data: {
      error: string;
      success: boolean;
    };
  };

  export type userResponse = {
      success: boolean,
      user: User
  }