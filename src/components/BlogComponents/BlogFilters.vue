<template>
    <div class="filters-container">
        <div class="article-search-bar">
            <SearchBar @search="handleSearch" />
        </div>
        <nav class="category-nav">
            <Tag v-for="(tag, index) in tags" :key="index" :text="tag" :color="'red'"
                @click.native="handleTagClick(tag)" />
        </nav>
        <div class="sort-wrapper">
            <label for="sort-select" class="sort-label">Sắp xếp theo:</label>
            <div class="sort-options">
                <button class="sort-btn" :class="{ 'active': sortOrder === 'newest' }" @click="handleSort('newest')">
                    Mới nhất
                </button>
                <button class="sort-btn" :class="{ 'active': sortOrder === 'mostView' }"
                    @click="handleSort('mostView')">
                    Xem nhiều nhất
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import SearchBar from "@/components/Common/Input/SearchBar.vue";
import Tag from "@/components/Common/Misc/Tag.vue";
import { useRouter } from "vue-router";

export default {
    components: { SearchBar, Tag },
    props: {
        tags: {
            type: Array,
            default: () => [],
        },
        currentSort: {
            type: String,
            default: "newest",
        },
    },
    setup(props) {
        const router = useRouter();
        const sortOrder = ref(props.currentSort);

        const handleSearch = (query) => {
            router.push({
                name: 'searchBlogs',
                query: { title: query.trim(), sort: sortOrder.value },
            });
        };

        const handleTagClick = (tag) => {
            router.push({
                name: 'searchBlogs',
                query: { tag, sort: sortOrder.value },
            });
        };

        const handleSort = (sortBy) => {
            sortOrder.value = sortBy;
            router.push({
                name: 'searchBlogs',
                query: { sort: sortOrder.value },
            });
        };

        return { handleSearch, handleTagClick, handleSort, sortOrder };
    },
};
</script>

<style scoped>
.filters-container {
    margin-bottom: 20px;
}

.article-search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.category-nav {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.sort-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.sort-label {
    font-size: 16px;
    color: #555;
}

.sort-options {
    display: flex;
    gap: 10px;
}

.sort-btn {
    padding: 8px 16px;
    font-size: 16px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.sort-btn.active {
    background-color: #5488c7;
    color: #fff;
    border-color: #5488c7;
}

.sort-btn:hover {
    background-color: #f1f1f1;
}

.tag {
    padding: 5px 12px;
    border-radius: 20px;
    background: #f3fcff;
    color: #389fe6;
    font: 600 14px/1.5 Inter, sans-serif;
    cursor: pointer;
    transition: all 0.3s;
}

.tag:hover {
    background: #e8f7ff;
}

.tag:active {
    background: #cceeff;
}
</style>