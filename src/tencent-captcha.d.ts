export {}
interface TencentCaptcha {
  new (captchaAppId: string, callback: (res?: any) => void, config: any): TencentCaptcha
  show()
}

declare global {
  const TencentCaptcha: TencentCaptcha
}
