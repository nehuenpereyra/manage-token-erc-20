export const useAppStore = defineStore({
  id: 'app-store',
  state: () => {
    return {
      urlScan:'https://testnet.bscscan.com/address/'
    }
  }
})