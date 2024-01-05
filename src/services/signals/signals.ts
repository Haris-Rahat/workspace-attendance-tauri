import { signal } from "@preact/signals-react";
import { deepSignal } from "@deepsignal/react";
import { IGeneralSettings, IUser } from "../../@types/types";

export const user = signal<IUser>({
  id: "",
  email: "",
  name: "",
  token: "",
  domain: "",
});

export const generalSettings = signal<IGeneralSettings>({
  timezone: {
    name: "Europe/Copenhagen",
  },
});

export const formState = signal({
  domain: "",
  email: "",
  password: "",
});

export const loading = signal(false);

export const usersList = deepSignal({});

export const projectAndTaskId = signal({
  projectId: undefined,
  taskId: undefined,
});
