import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'
import './styles/index.scss'

// 开发环境启动 MSW
if (import.meta.env.DEV) {
  const { worker } = await import('./mock/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

const app = createApp(App)
const pinia = createPinia()

// 注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 挂载前恢复用户状态（改成 restoreSession）
const userStore = useUserStore(pinia)
await userStore.restoreSession()

app.mount('#app')