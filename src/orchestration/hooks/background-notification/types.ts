import type { BackgroundTask } from "../../../execution/features/background-agent"

export interface BackgroundNotificationHookConfig {
  formatNotification?: (tasks: BackgroundTask[]) => string
}
