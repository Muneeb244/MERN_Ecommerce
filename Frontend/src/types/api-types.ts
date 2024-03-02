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