import mitt from "mitt"

const emitter = mitt()

export const useEventBus = () => {
  return {
    on: (event, callback) => {
      emitter.on(event, callback)
    },
    off: (event, callback) => {
      emitter.off(event, callback)
    },
    emit: (event, data) => {
      emitter.emit(event, data)
    },
  }
}