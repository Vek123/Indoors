export interface User {
  id: number;
  first_name: string;
}
export interface Message {
  id: number;
  dialog: number;
  created_at: string;
  content: string;
  author: User;
}
export interface Cat {
  id?: number;
  name: string;
  age: number;
  breed: string;
  skin: string;
}
export interface NavItem {
  name: string;
  link: string;
}
export interface LoginForm {
  username: string;
  password: string;
}
export interface Dialog {
  id: number | string;
  members: User[];
}

export type ApiResponseHandlers = {
  onErrorCallback?: (error: any) => void;
  onSuccessCallback?: (response: any) => void;
}
