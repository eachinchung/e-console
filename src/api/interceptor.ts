import type { AxiosError } from "axios"

import { useUserStore } from "@/store"
import { CallbackRes } from "@/types/tencent-captcha"
import { Message } from "@arco-design/web-vue"

interface ErrResponse<T = any> {
  err_code: number
  message: string
  detail?: T
}

interface NeedCaptchaRsp {
  signature: string
  captcha_app_id: string
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

const NotErrMessageAPI = [
  {
    url: "/auth/token",
    method: "post",
  },
]

axios.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const token = userStore.getToken()
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error(error)
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    if (!error.response) {
      Message.error(error.msg || "Request Error")
      return Promise.reject(error)
    }

    const userStore = useUserStore()
    const { data }: { data: ErrResponse<NeedCaptchaRsp> } = error.response

    switch (data.err_code) {
      // 100107 - token 已过期
      case 100107:
        if (error.response.config.url === "/auth/token") {
          break
        }
        try {
          await userStore.refreshToken()
        } catch (error) {
          console.error(error)
          return Promise.reject(error)
        }
        return axios(error.response.config)

      // 100113 - 验证客户不是机器人
      case 100113:
        return new Promise((resolve, reject) => {
          try {
            const captcha = new TencentCaptcha(data.detail!.captcha_app_id, res => resolve(res), {
              needFeedBack: false,
            })
            captcha.show()
          } catch (error) {
            console.error(error)
            reject(error)
            Message.warning("验证码初始化失败，请稍后再试")
          }
        }).then(v => {
          const res = v as CallbackRes
          switch ((res as CallbackRes).ret) {
            case 0:
              const body = JSON.parse(error.response.config.data)
              body.ticket = res.ticket
              body.rand_str = res.randstr
              body.signature = data.detail!.signature
              error.response.config.data = body
              return axios(error.response.config)
            case 2:
              break
            default:
              console.error(res)
              Message.warning("验证码服务繁忙，请稍后再试")
          }

          return Promise.reject(error)
        })
    }

    for (const api of NotErrMessageAPI) {
      if (error.response.config.url === api.url && error.response.config.method.toLowerCase() === api.method) {
        return Promise.reject(error)
      }
    }

    console.error(error)
    Message.error(data.message)
    return Promise.reject(error)
  },
)
