<template>
    <div class="search-results-container">
        <h1 class="search-results-heading">Kết quả tìm kiếm</h1>

        <div v-if="filteredArticles.length === 0" class="no-results">
            <p>Không tìm thấy bài viết nào.</p>
        </div>

        <div v-else>
            <div class="articles-list">
                <div v-for="article in filteredArticles" :key="article.id" class="article-card">
                    <a :href="article.Link" class="article-link">
                        <img :src="article.Thumb" :alt="article.Title" class="article-image" />
                    </a>
                    <div class="article-content">
                        <a :href="article.Link" class="article-title">{{ article.Title }}</a>
                        <time class="article-date">{{ article.Date }}</time>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import data from '../../api/data.json';

export default {
    name: 'SearchBlogResult',

    mounted() {
        console.log("Route query params:", this.$route.query);
    },
    data() {
        return {
            articles: data.BlogList.FeaturedArticles,
            query: this.$route.query,
        };
    },
    computed: {
        filteredArticles() {
            const { title, tag } = this.$route.query;
            console.log("Searching for:", title);
            console.log("Searching for tag:", tag);
            console.log("data", data);
            const searchTerm = title ? title.trim().toLowerCase() : "";

            let result = [];

            for (let article of this.articles) {
                const normalizedTitle = article.Title.trim().toLowerCase();
                const matchesTitle = normalizedTitle.includes(searchTerm);
                const matchesTag = tag ? article.Tags.some(t => t.toLowerCase() === tag.toLowerCase()) : true;
                if (matchesTitle && matchesTag) {
                    result.push(article);
                }
            }
            return result;
        }
    }


};
</script>

<style scoped>
.search-results-container {
    margin-top: 60px;
    padding: 0 20px;
}

.search-results-heading {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.no-results {
    text-align: center;
    font-size: 18px;
}

.articles-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(279px, 1fr));
    gap: 20px;
}

.article-card {
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.article-title {
    margin-top: 16px;
    font-size: 24px;
    color: #000;
}

a.article-title {
    text-decoration: none;
}

.article-excerpt {
    margin-top: 10px;
    font: 400 17px/25px Inter, sans-serif;
    color: #000;
}

.article-image {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
}

.article-date {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
}
</style>
