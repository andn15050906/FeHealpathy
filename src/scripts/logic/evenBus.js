// Tạo một event bus đơn giản cho Vue 3
import { ref } from "vue"

// Singleton instance
let eventBus = null

export function useEventBus() {
  if (eventBus) return eventBus

  const events = ref(new Map())

  eventBus = {
    on(event, callback) {
      if (!events.value.has(event)) {
        events.value.set(event, [])
      }
      events.value.get(event).push(callback)
    },

    off(event, callback) {
      if (!events.value.has(event)) return

      const callbacks = events.value.get(event)
      const index = callbacks.indexOf(callback)

      if (index !== -1) {
        callbacks.splice(index, 1)
      }

      if (callbacks.length === 0) {
        events.value.delete(event)
      }
    },

    emit(event, ...args) {
      if (!events.value.has(event)) return

      for (const callback of events.value.get(event)) {
        callback(...args)
      }
    },
  }

  return eventBus
}
