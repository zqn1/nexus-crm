import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 导出 worker，供 main.js 启动
export const worker = setupWorker(...handlers)