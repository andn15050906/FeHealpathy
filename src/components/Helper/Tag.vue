<template>
    <a href="#">
        <v-chip :color="this.color" class="tag-link">{{ this.text }}</v-chip>
    </a>
</template>

<script>
export default {
    name: 'Tag',
    props: {
        text: String,
        color: String
    }
}
</script>

<style>
.tag-link {
    padding: 7px 22px;
    border-radius: 50px;
    background: #f7f7f7;
    color: #000;
    text-decoration: none;
    font: 400 17px/32px Inter, sans-serif;
}
</style>