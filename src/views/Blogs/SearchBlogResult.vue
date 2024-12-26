<template>
    <div class="search-results-container">
        <BlogFilters
            :tags="['Meditation & Mindfulness', 'Stress & Anxiety', 'Sleep', 'Mental Health', 'Personal Growth']"
            :currentSort="currentSort" @search="handleSearch" @tag-click="handleTagClick"
            @sort-change="handleSortChange" />

        <div v-if="filteredResults.articles.length === 0" class="no-results">
            <p>Không tìm thấy kết quả nào.</p>
        </div>

        <div v-else>
            <div class="articles-list">
                <BlogCardWithTags v-for="article in paginatedArticles" :article="article" :key="article.id"
                    class="article-card" />
            </div>

            <div class="categories-list">
                <div v-for="category in filteredResults.categories" :key="category.Id" class="category-card">
                    <a :href="category.Link" class="category-link">
                        <span class="category-title">{{ category.Title }}</span>
                    </a>
                </div>
            </div>

            <!-- Pagination -->
            <Pagination :currentPage="currentPage" :totalPages="totalPages" :goToPage="goToPage" />
        </div>
    </div>
</template>

<script>
import BlogCardWithTags from '@/components/BlogComponents/BlogCardWithTags.vue';
import data from '../../api/data.json';
import BlogFilters from '../../components/BlogComponents/BlogFilters.vue';
import Pagination from '@/components/Common/Pagination.vue';

export default {
    name: 'SearchBlogResult',
    components: {
        BlogCardWithTags,
        BlogFilters,
        Pagination
    },
    data() {
        return {
            featuredArticles: data.BlogList.FeaturedArticles,
            articles: data.BlogList.Articles,
            categories: data.BlogList.Categories,
            currentPage: 1,
            perPage: 6,
            currentSort: this.$route.query.sort || 'newest',
            query: this.$route.query,
        };
    },
    computed: {
        filteredResults() {
            const { title, tag, category } = this.$route.query;
            const searchTerm = title ? title.trim().toLowerCase() : "";
            const selectedTag = tag ? tag.trim().toLowerCase() : null;
            const selectedCategory = category ? category.trim().toLowerCase() : null;

            const allArticles = [...this.featuredArticles, ...this.articles];

            let filteredArticles = allArticles.filter(article => {
                const matchesTitle = searchTerm
                    ? article.Title.trim().toLowerCase().includes(searchTerm)
                    : true;

                const matchesTag = selectedTag
                    ? article.Tags.some(t => t.trim().toLowerCase() === selectedTag)
                    : true;

                const matchesCategory = selectedCategory
                    ? article.Tags.some(t => t.trim().toLowerCase() === selectedCategory)
                    : true;

                return matchesTitle && matchesTag && matchesCategory;
            });

            if (this.currentSort === 'mostView') {
                filteredArticles.sort((a, b) => b.Views - a.Views);
            } else if (this.currentSort === 'newest') {
                filteredArticles.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            }

            return {
                articles: filteredArticles
            };
        },

        totalPages() {
            return Math.ceil(this.filteredResults.articles.length / this.perPage);
        },

        paginatedArticles() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = start + this.perPage;
            return this.filteredResults.articles.slice(start, end);
        }
    },

    methods: {
        handleSearch(query) {
            this.$router.push({ path: '/search-blogs', query: { title: query, page: 1 } });
        },

        // keep in both BlogCardWithTags and SearchBlogResult
        handleTagClick(tagOrCategory) {
            if (tagOrCategory.Title) {
                this.$router.push({ path: '/search-blogs', query: { category: tagOrCategory.Id, page: 1 } });
            } else {
                this.$router.push({ path: '/search-blogs', query: { tag: tagOrCategory, page: 1 } });
            }
        },

        goToPage(page) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
                this.$router.push({ path: '/search-blogs', query: { ...this.$route.query, page: this.currentPage } });
            }
        },

        handleSortChange(sort) {
            this.currentSort = sort;
            this.$router.push({ path: '/search-blogs', query: { ...this.$route.query, page: 1, sort: this.currentSort } });
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

.article-image {
    width: 100%;
    border-radius: 10px;
    object-fit: cover;
}

.article-date {
    display: block;
    margin-top: 10px;
    font: 400 13px/1 Inter, sans-serif;
    color: #999;
}

.categories-list {
    margin-top: 40px;
}

.category-card {
    padding: 10px;
}

.category-title {
    font-size: 20px;
    color: #000;
    text-decoration: none;
}

.article-tags {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.article-tag {
    padding: 5px 10px;
    font-size: 12px;
    background-color: #f2f2f2;
    border-radius: 5px;
    cursor: pointer;
    color: #007bff;
    transition: background-color 0.3s;
}

.article-tag:hover {
    background-color: #e0e0e0;
}

@media (max-width: 1000px) {
    .category-nav {
        padding: 0 20px;
    }

    .featured-heading {
        margin-top: 40px;
    }

    .featured-grid {
        grid-template-columns: 1fr;
    }

    .article-grid {
        grid-template-columns: 1fr;
    }

    .article-title {
        font-size: 28px;
        line-height: 36px;
    }
}
</style>