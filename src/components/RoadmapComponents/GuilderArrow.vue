<template>
    <div class="wrapper">
      <svg
        width="18px"
        height="17px"
        viewBox="0 0 18 17"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
      >
        <g
          id="prev"
          transform="translate(8.5, 8.5) scale(-1, 1) translate(-8.5, -8.5)"
        >
          <polygon class="arrow" :class="{ animate: isHovered }" points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"></polygon>
          <polygon class="arrow-fixed" :class="{ animate: isHovered }" points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"></polygon>
          <path :class="{ animate: isHovered }" d="M-1.48029737e-15,0.56157424 L-1.48029737e-15,16.1929159 L9.708,8.33860465 L-2.66453526e-15,0.56157424 L-1.48029737e-15,0.56157424 Z M1.33333333,3.30246869 L7.62533333,8.34246869 L1.33333333,13.4327013 L1.33333333,3.30246869 L1.33333333,3.30246869 Z"></path>
        </g>
      </svg>
  
      <svg
        width="18px"
        height="17px"
        viewBox="-1 0 18 17"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        @mouseover="handleMouseOver"
        @mouseleave="handleMouseLeave"
      >
        <g>
          <polygon class="arrow" :class="{ animate: isHovered }" points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"></polygon>
          <polygon class="arrow-fixed" :class="{ animate: isHovered }" points="16.3746667 8.33860465 7.76133333 15.3067621 6.904 14.3175671 14.2906667 8.34246869 6.908 2.42790698 7.76 1.43613596"></polygon>
          <path :class="{ animate: isHovered }" d="M-4.58892184e-16,0.56157424 L-4.58892184e-16,16.1929159 L9.708,8.33860465 L-1.64313008e-15,0.56157424 L-4.58892184e-16,0.56157424 Z M1.33333333,3.30246869 L7.62533333,8.34246869 L1.33333333,13.4327013 L1.33333333,3.30246869 L1.33333333,3.30246869 Z"></path>
        </g>
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isHovered: false,
      };
    },
    methods: {
      handleMouseOver() {
        this.isHovered = true;
      },
      handleMouseLeave() {
        this.isHovered = false;
      },
    },
  };
  </script>
  
  <style scoped>  
  .wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  svg {
    width: 100px;
    height: auto;
    margin: 0 2rem;
    cursor: pointer;
    overflow: visible;
  }
  
  /*polygon,
  path {
    transition: all 0.5s $ease;
  }
  
  svg:hover polygon,
  svg:hover path {
    transition: all 1s $ease;
    fill: #FF4136;
  }
  
  svg:hover .arrow {
    animation: arrow-anim 2.5s $ease infinite;
  }
  
  svg:hover .arrow-fixed {
    animation: arrow-fixed-anim 2.5s $ease infinite;
  }*/
  
  @keyframes arrow-anim {
    0% {
      opacity: 1;
      transform: translateX(0);
    }
    5% {
      transform: translateX(-0.1rem);
    }
    100% {
      transform: translateX(1rem);
      opacity: 0;
    }
  }
  
  @keyframes arrow-fixed-anim {
    5% {
      opacity: 0;
    }
    20% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  
  .arrow.animate {
    animation: arrow-anim 2.5s cubic-bezier(.2, 1, .3, 1) infinite;
  }
  
  .arrow-fixed.animate {
    animation: arrow-fixed-anim 2.5s cubic-bezier(.2, 1, .3, 1) infinite;
  }
  </style>  