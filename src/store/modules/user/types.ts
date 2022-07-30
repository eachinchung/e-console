import { UserInfo } from "@/api/user"

export interface UserState {
  info?: UserInfo
  token?: string
}
