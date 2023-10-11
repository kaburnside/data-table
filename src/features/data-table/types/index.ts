export type UserData = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  registeredDate: Date;
  isPrivate: boolean;
};

export type ReturnedQueryData = {
  data: UserData[];
  meta: {
    totalRowCount: number;
  };
};
