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

export interface IFormState {
  domain: string;
  email: string;
  password: string;
}

export type Loading = boolean;

export interface IProjectAndTaskId {
  projectId?: string;
  taskId?: string;
}

export interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  jobTitle: {
    jobTitle: string;
    __typename: string;
  };
  __typename: string;
}

export interface IEmployeeList {
  [key: string]: IEmployee;
}
