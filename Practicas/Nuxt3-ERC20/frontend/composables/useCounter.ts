export const useCounter = () => {
  const count = ref<number>(0)
  
  function increment() {
    count.value++
  }
  return {count, increment}
}