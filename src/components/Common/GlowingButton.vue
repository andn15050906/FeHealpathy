<template>
    <button class="glowing-button" :style="{
        background: getBgColor,
        color: textColor,
        justifyContent: justify
    }">
        <slot />
    </button>
</template>

<script>
export default {
    name: 'GlowingButton',
    props: {
        primaryColor: String,
        secondaryColor: String,
        textColor: {
            type: String,
            default: '#fff'
        },
        justify: {
            type: String,
            default: 'center'
        },
    },
    computed: {
        getBgColor() {
            return `linear-gradient(to bottom, ${this.primaryColor}, ${this.secondaryColor})`;
        }
    }
}
</script>

<style scoped>
.glowing-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 300px;
    max-height: 300px;
    padding: 16px 32px;
    text-align: center;
    border-radius: 100px;
    cursor: pointer;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease;
}

.glowing-button:hover {
    transform: scale(1.05);
}
</style>