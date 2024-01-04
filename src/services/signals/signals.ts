import { signal } from "@preact/signals";
import { User } from "../../context/authContext";

export const user = signal<User>({
  id: "",
  email: "",
  name: "",
  token: "",
  domain: "",
});

export const formState = signal({
  domain: "",
  email: "",
  password: "",
});

export const loading = signal(false);
