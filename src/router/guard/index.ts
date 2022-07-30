import { Router } from "vue-router"

import setupPermissionGuard from "./permission"
import setupUserLoginInfoGuard from "./user-login-info"

export default function createRouteGuard(router: Router) {
  // setupPageGuard(router)
  setupUserLoginInfoGuard(router)
  setupPermissionGuard(router)
}
