<template>
    <div class="glowing-card" :style="{
        background: getBgColor,
        justifyContent: justify,
        padding: padding,
        boxShadow: shadow,
    }">
        <slot />
    </div>
</template>

<script>
export default {
    name: 'GlowingCard',
    props: {
        primaryColor: String,
        secondaryColor: String,
        justify: {
            type: String,
            default: 'center'
        },
        padding: {
            type: String,
            default: '20px'
        },
        shadow: {
            type: String,
            default: '0px 4px 8px rgba(0, 0, 0, 0.2)'
        }
    },
    computed: {
        getBgColor() {
            return `linear-gradient(to bottom, ${this.primaryColor}, ${this.secondaryColor})`;
        }
    }
}
</script>

<style scoped>
.glowing-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    aspect-ratio: 1;
    max-width: 300px;
    max-height: 300px;
    text-align: center;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.glowing-card:hover {
    transform: scale(1.05);
}
</style>