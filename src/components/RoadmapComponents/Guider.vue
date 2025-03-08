<template>
  <div v-if="isShown" class="guideRing" :style="{
    width: width + 'px',
    height: height + 'px',
    top: top + 'px',
    left: left + 'px',
    position: position,
    }"></div>
    <!--<div class="guideRing" :style="circleStyle"></div>-->
</template>
  
  <script>
  export default {
    data() {
      return {
        isShown: true,
        targetElementId: null,
        width: 150,
        height: 100,
        top: -100,
        left: -100,
        position: 'absolute'
      }
    },
    methods: {
      hide() {
        this.isShown = false;
      },
      highlight(targetElementId, offsetX, offsetY, width, height, position) {
        this.targetElementId = targetElementId;

        if (width)
          this.width = width;
        if (height)
          this.height = height;
        if (position)
          this.position = position;

        let rect = document.getElementById(this.targetElementId).getBoundingClientRect();

        let maxDimension = Math.max(rect.width, rect.height);
        this.width = maxDimension;
        this.height = maxDimension;

        this.left = rect.left + rect.width / 2 - this.width / 2;
        this.top = rect.top + rect.height / 2 - this.height / 2;
        
        /*this.left = rect.left + window.scrollX + rect.width / 2 + offsetX;// + this.width / 2;
        this.top = rect.top + window.scrollY + rect.height / 2 + offsetY;// - this.height / 2;*/

        /*if (offsetX) {
          this.top = rect.left + window.scrollX + rect.width / 2 + offsetX + this.width / 2;
        }
        if (offsetY) {
          this.left = rect.top + window.scrollY + rect.height / 2 + offsetY - this.height;
        }*/
      }
    },
  };
  </script>
  
  <style scoped>
  .guideRing {
    background-image: url("/assets/images/GuiderRing.gif");
    background-size: contain;
    background-position: center;
    pointer-events: none;
    z-index: 1001;
  }
  </style>