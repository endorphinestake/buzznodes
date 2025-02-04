export type TGroup = {
  id: number;
  name: string;
};

export type TUserPhone = {
  id: number;
  phone: string;
  status: boolean;
  updated: Date;
};

export type TUser = {
  id: number;
  email: string;
  locale: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  groups: TGroup[];
  phones: TUserPhone[];
};
