// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
// export default delay

import * as blueBird from 'bluebird'

blueBird.Promise.config({
  cancellation: true
})

const delay = (ms: number) => new blueBird.Promise((resolve, reject, onCancel) => {
  const id = setTimeout(resolve, ms)
  onCancel(() => {clearTimeout(id)})
})

export default delay
