import { hookstate } from "@hookstate/core";
import {
  IEmployeeList,
  IGeneralSettings,
  IProjectAndTaskId,
  IUser,
  Loading,
} from "../../@types/types";

export const UserState = hookstate<IUser>({
  id: "",
  email: "",
  name: "",
  token: "",
  domain: "",
});

export const GeneralSettingsState = hookstate<IGeneralSettings>({
  timezone: {
    name: "Europe/Copenhagen",
  },
});


export const LoadingState = hookstate<Loading>(false);

export const ProjectAndTaskIdState = hookstate<IProjectAndTaskId>({
  projectId: undefined,
  taskId: undefined,
});

export const EmployeeListState = hookstate<IEmployeeList>({});
