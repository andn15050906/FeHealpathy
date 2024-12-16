<template>
    <button 
      class="scroll-top"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d8487613a136fbe46304eee3e08327c44da2b16e6ba97e1adc67484898a9c6f?apiKey=581cb509eedd462787009da53a17f69a&" alt="" class="scroll-icon" />
    </button>
  </template>
  
  <script>
  export default {
    name: 'ScrollToTop',
    methods: {
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }
  </script>
  
  <style scoped>
  .scroll-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 45px;
    height: 45px;
    border-radius: 3px;
    background: #5488c7;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 100;
  }
  
  .scroll-icon {
    width: 19px;
    height: 21px;
  }
  
  @media (max-width: 991px) {
    .scroll-top {
      right: 10px;
    }
  }
  </style>