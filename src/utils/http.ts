const user = JSON.parse(uni.getStorageSync('user'))
const { MODE, VITE_PROD_BASE_URL } = import.meta.env
// 请求前缀
const prefix: string = '/rider'
const baseUrl: string = MODE !== 'development' ? VITE_PROD_BASE_URL : ''
const whiteList: string[] = []

// 拦截器
uni.addInterceptor('request', {
  invoke(args) {
    uni.showLoading({
      title: '加载中...'
    })

    args.url = prefix.length && !args.url.includes('open') ? baseUrl + prefix + args.url : baseUrl + args.url

    args.header = {
      'content-type': args.method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded',
      'usertoken': user.token ? user.token : ''
    }

    const data = args.method === 'GET' ? args.params : args.data

  },
  // success(args) {
  //   uni.hideLoading()
  // },
  // fail(args) {
  //   uni.hideLoading()
  // },
  complete() {
    uni.hideLoading()
  }
})

export const http = {
  get<T = any>(url: string, params: Record<string, any> = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      uni.request({
        url,
        method: 'GET',
        data: params,
        complete: (res: any) => {
          if (res.data.code == 0) {
            resolve(res.data.result)
          } else {
            setTimeout(() => {
              uni.showToast({
                title: res.data.msg,
                icon: 'error',
              })
            }, 100)

            reject(res.data)
          }
        }
      })
    })
  },

  post<T = any>(url: string, data: Record<string, any> = {}): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      uni.request({
        url,
        method: 'POST',
        data,
        complete: (res: any) => {
          if (res.data.code == 0) {
            resolve(res.data.result)
          } else {
            setTimeout(() => {
              uni.showToast({
                title: res.data.msg,
                icon: 'error',
              })
            }, 100)

            reject(res.data)
          }
        }
      })
    })
  }
}