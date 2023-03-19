export const useCurrencyStore = defineStore({
  id: 'currency-store',
  state: () => {
    return {
      currency: {
        name: 'Polygon',
        symbol: 'MATIC',
        icon: 'cryptocurrency-color:matic'
      },
      token: {
        name: 'Asian Token',
        symbol: 'AT',
        img: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png?v=024'
      }
    }
  },
  actions: {}
})