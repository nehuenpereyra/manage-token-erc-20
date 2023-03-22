export const useCurrencyStore = defineStore({
  id: 'currency-store',
  state: () => {
    return {
      currency: {
        name: 'BNB',
        symbol: 'BNB',
        icon: 'cryptocurrency-color:bnb'
      },
      token: {
        name: 'CGS',
        symbol: 'CGS',
        img: '/img/CGeass.png'
      }
    }
  },
  actions: {}
})