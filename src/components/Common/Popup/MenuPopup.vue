<!-- Doesn't contain css -->
<template>
    <div class="vac-menu-options">
        <div class="vac-menu-list">
            <div v-for="option in options">
                <div class="vac-menu-item" @click="option.callback">{{option.text}}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    options: {
        type: Array,
        required: true,
    }
});
</script>