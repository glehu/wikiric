const WorkerRic = {
  worker: null,
  execute: function (payload) {
    if (!this.worker) return
    return new Promise((resolve, reject) => {
      // Open new MessageChannel
      const channel = new MessageChannel()
      // Set up response listener
      channel.port1.onmessage = ({ data }) => {
        channel.port1.close()
        if (data.error) {
          reject(data.error)
        } else {
          resolve(data)
        }
      }
      // Submit payload to worker
      this.worker.postMessage(payload, [channel.port2])
    })
  }
}
export default WorkerRic
