<template>
    <div v-if="message" :class="['alert', status ? 'alert-success' : 'alert-danger']" id="app-alert">
      {{ message }}
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      const alert = document.getElementById('app-alert');
      setTimeout(() => {
        alert.style.display = 'none';
      }, 10000);
    }
  };
  </script>
  
  <style scoped>
  #app-alert {
    font-size: 18px;
    border-radius: 100px;
    margin-bottom: 5px;
    padding: 24px;
  }
  
  .alert-danger {
    color: red;
    background: pink;
  }
  
  .alert-success {
    color: #3c763d;
    background-color: #dff0d8;
  }
  </style>
  