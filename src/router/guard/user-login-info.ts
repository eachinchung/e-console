import NProgress from "nprogress"
import type { Router, LocationQueryRaw } from "vue-router"

import { useUserStore } from "@/store"

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    if (["login"].includes(to.name as string)) {
      next()
      return
    }

    const user = useUserStore()

    if (user.isLogin()) {
      if (user.info) {
        next()
        return
      }

      try {
        await user.fetchInfo()
        next()
      } catch (error) {
        next({
          name: "login",
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        })
      }

      return
    }

    next({
      name: "login",
      query: {
        redirect: to.name,
        ...to.query,
      } as LocationQueryRaw,
    })
  })
}
