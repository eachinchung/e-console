<template>
  <div class="container">
    <div class="content">
      <a-result class="result" status="404" subtitle="抱歉，页面不见了～"> </a-result>
      <div class="operation-row">
        <a-button key="again" style="margin-right: 16px" @click="reload()"> 重试 </a-button>
        <a-button key="back" type="primary" @click="router.go(-1)"> 返回 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const router = useRouter()
  const reload = () => location.reload()
</script>

<style scoped lang="less">
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -95px;
    margin-top: -121px;
    text-align: center;
    :deep(.content) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      background-color: var(--color-bg-1);
      border-radius: 4px;
    }
  }
</style>
