<template>
    <div>
      <div v-if="!isPremium" class="overlay">
        <div class="overlay-content">
          <h2>Premium Content Only</h2>
          <p>You need a premium account to access this content.</p>
          <button @click="redirectToUpgrade">Upgrade to Premium</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PremiumContentBlocker',
    props: {
      isPremium: {
        type: Boolean,
        required: false
      }
    },
    methods: {
      redirectToUpgrade() {
        this.$router.push('/upgrade');
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .overlay-content {
    text-align: center;
  }
  .button {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    background-color: #ff5722;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }
  .button:hover {
    background-color: #e64a19;
  }
  </style>