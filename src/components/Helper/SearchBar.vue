<template>
    <div class="search-container">
        <form class="search-form" role="search" @submit.prevent="onSearch">
            <input type="search" id="search" class="search-input" v-model="searchInput" :placeholder="placeHolder"
                :aria-label="placeHolder" />
            <button type="submit" class="search-button" aria-label="Search">
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/4f7ae77af3c87898e20a40930c274447641587a7d6bf7955ae5a37c10cc2aebd?apiKey=581cb509eedd462787009da53a17f69a&"
                    alt="" class="search-icon" />
            </button>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        initialQuery: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            placeHolder: "Tìm kiếm trên Healpathy",
            searchInput: this.initialQuery
        };
    },
    methods: {
        onSearch() {
            this.$emit('search', this.searchInput);
        }
    }
}
</script>

<style scoped>
.search-container {
    flex: 1;
    margin: 0 20px;
}

.search-form {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 12px 26px;
    border: 2px solid #d6d6d7;
    border-radius: 3px;
    font: 400 14px Roboto, sans-serif;
}

.search-input:focus {
    outline: none;
}

.search-button {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: #5488c7;
    border: none;
    border-radius: 0 4px 4px 0;
    padding: 0 13px;
    cursor: pointer;
}

.search-icon {
    width: 14px;
    height: 15px;
}
</style>