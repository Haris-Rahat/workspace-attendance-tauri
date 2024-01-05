export interface IUser {
  id: string;
  email: string;
  name: string;
  token: string;
  domain: string;
}

export interface IGeneralSettings {
  timezone: {
    name: string;
  };
}
