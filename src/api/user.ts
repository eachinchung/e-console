export interface LoginBody {
  username: string
  password: string
  ticket?: string
  rand_str?: string
  signature?: string
}

export interface LoginRsp {
  token: string
  expire: string
}

export interface UserInfo {
  id?: number
  phone: string
  eid: string
  avatar?: string
  nickname: string
  state: number
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface UserInfoRsp extends UserInfo {}

export function login(data: LoginBody) {
  return axios.post<LoginRsp>("/auth/token", data)
}

export function refreshToken() {
  return axios.put<LoginRsp>("/auth/token")
}

export function getUserInfo(eid: string) {
  return axios.get<UserInfo>(`/v1/users/${eid}`)
}
