import { Gender } from "./Gender";

export type Patient = {
  name: string;
  addr: string;
  gender: Gender;
  birthdate: string;
};
