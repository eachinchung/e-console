<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录 E Service</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form ref="loginForm" :model="userInfo" class="login-form" layout="vertical" @submit="handleSubmit">
      <a-form-item
        field="username"
        :rules="[
          { required: true, message: '用户名不能为空' },
          { maxLength: 20, message: '必须小于 20 个字符' },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.username" placeholder="请输入手机号 或 EID">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password v-model="userInfo.password" placeholder="请输入密码" allow-clear>
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox checked="rememberMe" :model-value="rememberMe" @change="setRememberMe as any">
            记住我
          </a-checkbox>
          <a-link>忘记密码</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading"> 登录 </a-button>
        <a-button type="text" long class="login-form-register-btn"> 注册 </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { LoginBody } from "@/api/user"
  import useLoading from "@/hooks/loading"
  import { useUserStore } from "@/store"
  import { ValidatedError } from "@arco-design/web-vue/es/form/interface"
  import { IconLock, IconUser } from "@arco-design/web-vue/es/icon"

  const router = useRouter()
  const userStore = useUserStore()

  const errorMessage = ref("")
  const { loading, setLoading } = useLoading()

  const rememberMe = useStorage("remember-me", true)
  const userInfo = reactive<LoginBody>({
    username: "",
    password: "",
  })

  const handleSubmit = async ({ errors }: { errors: Record<string, ValidatedError> | undefined }) => {
    if (errors) {
      return
    }

    setLoading(true)
    try {
      await userStore.login(userInfo)
      await userStore.fetchInfo()
    } catch (e) {
      if (!(e as any).response) {
        errorMessage.value = (e as Error).message
        return
      }

      errorMessage.value = (e as any).response.data.message
    } finally {
      setLoading(false)
    }
  }

  const setRememberMe = (value: boolean) => {
    rememberMe.value = value
  }
</script>

<style scoped lang="less">
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
