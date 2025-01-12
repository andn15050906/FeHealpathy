<template>
    <div class="container">
        <div class="content-wrapper">
            <div class="pagination">
                <button class="page-dot active" aria-label="Page 1"></button>
                <button class="page-dot" aria-label="Page 2"></button>
                <button class="page-dot" aria-label="Page 3"></button>
            </div>

            <section class="comments-section">
                <h3 class="section-title">Bình luận</h3>
                <form class="comment-form" @submit.prevent="submitComment">
                    <label for="commentInput" class="visually-hidden">
                        Hãy chia sẻ cảm nghĩ của bạn về bài viết
                    </label>
                    <textarea id="commentInput" class="comment-input"
                        placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết"
                        aria-label="Hãy chia sẻ cảm nghĩ của bạn về bài viết"></textarea>
                    <button type="submit" class="submit-button">Gửi</button>
                </form>

                <div class="comment-filters">
                    <button class="filter-button active">Hot nhất</button>
                    <button class="filter-button">Mới nhất</button>
                </div>

                <div class="comments-list">
                    <article v-for="(comment, index) in comments" :key="index" class="comment-item">
                        <img :src="comment.avatar" :alt="`${comment.author}'s avatar`" class="avatar" />
                        <div class="comment-content">
                            <div class="comment-header">
                                <div class="comment-author">{{ comment.author }}</div>
                                <div class="comment-date">{{ comment.date }}</div>
                            </div>
                            <p class="comment-text">{{ comment.text }}</p>
                            <div class="comment-actions">
                                <button class="action-button">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/057be5174069cee3fb8d890121c15bd5d66134b62a2ef8be669c9feb57993a77?apiKey=581cb509eedd462787009da53a17f69a&"
                                        alt="" class="action-icon" />
                                    <span>{{ comment.likes }}</span>
                                </button>
                                <button class="action-button">
                                    <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/38ca355c5629335bed6368fdd17b30ced0048e325b22e960be2b58778feb36f6?apiKey=581cb509eedd462787009da53a17f69a&"
                                        alt="" class="action-icon" />
                                    <span>Trả lời</span>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                <button class="load-more">Tải thêm bình luận</button>
            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogCommentSection',
    data() {
        return {
            relatedArticles: [
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                },
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                },
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                }
            ],
            authorArticles: [
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                },
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                },
                {
                    title: 'Tạo RESTful API với Golang và MongoDB',
                    author: 'Lao Văn Tuấn',
                    readTime: '2 phút đọc',
                    views: '7.6K',
                    comments: '7',
                    likes: '6',
                    shares: '9'
                }
            ],
            comments: [
                {
                    author: 'duongAQ',
                    avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e66ce5ecd6163c18d645912b45af4a08797755ba2eb35fbe8b4594df65f645fd?apiKey=581cb509eedd462787009da53a17f69a&',
                    date: '3 tháng 12',
                    text: 'Đọc bài mà cảm giác cứ như đang nhớ về nyc ấy...',
                    likes: '3'
                },
                {
                    author: 'duongAQ',
                    avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e66ce5ecd6163c18d645912b45af4a08797755ba2eb35fbe8b4594df65f645fd?apiKey=581cb509eedd462787009da53a17f69a&',
                    date: '3 tháng 12',
                    text: 'Đọc bài mà cảm giác cứ như đang nhớ về nyc ấy...',
                    likes: '3'
                },
                {
                    author: 'duongAQ',
                    avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e66ce5ecd6163c18d645912b45af4a08797755ba2eb35fbe8b4594df65f645fd?apiKey=581cb509eedd462787009da53a17f69a&',
                    date: '3 tháng 12',
                    text: 'Đọc bài mà cảm giác cứ như đang nhớ về nyc ấy...',
                    likes: '3'
                },
                {
                    author: 'duongAQ',
                    avatar: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e66ce5ecd6163c18d645912b45af4a08797755ba2eb35fbe8b4594df65f645fd?apiKey=581cb509eedd462787009da53a17f69a&',
                    date: '3 tháng 12',
                    text: 'Đọc bài mà cảm giác cứ như đang nhớ về nyc ấy...',
                    likes: '3'
                }
            ]
        }
    },
    methods: {
        submitComment() {
            // Handle comment submission
        }
    }
}
</script>

<style scoped>
.container {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content-wrapper {
    width: 1110px;
    max-width: 100%;
    display: flex;
    flex-direction: column;
}

.section-title {
    color: #1b1b1b;
    font: 700 18px/1.2 Roboto, sans-serif;
    margin-bottom: 10px;
}

.articles-grid {
    margin-top: 10px;
}

.articles-row {
    display: flex;
    gap: 20px;
}

.article-card {
    flex: 1;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0 2px 4px rgba(27, 27, 27, 0.075);
    border: 1px solid rgba(27, 27, 27, 0.125);
}

.card-content {
    padding: 20px;
}

.article-title {
    color: #0b1a33;
    font: 400 18px/24px Roboto, sans-serif;
    margin-bottom: 8px;
}

.author-name {
    color: #5488c7;
    font: 400 14px/1.6 Roboto, sans-serif;
    display: block;
    margin-bottom: 4px;
}

.read-time {
    color: #9b9b9b;
    font: 400 13px/1.6 Roboto, sans-serif;
}

.engagement-stats {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 5px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #9b9b9b;
    font: 400 14px/2 Roboto, sans-serif;
}

.stat-icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

.stat-group {
    display: flex;
    align-items: center;
    gap: 4px;
}

.stat-icons {
    display: flex;
    flex-direction: column;
}

.pagination {
    display: flex;
    gap: 8px;
    margin: 8px auto;
}

.page-dot {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #000;
    border: none;
    padding: 0;
    cursor: pointer;
}

.page-dot.active {
    background: #007aff;
}

.comments-section {
    margin-top: 32px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.002);
    box-shadow: 0 10px 15px -3px rgba(47, 181, 250, 0.05);
    border: 1px solid #ebeef5;
    padding: 41px;
    max-width: 100%;
}

.comment-form {
    display: flex;
    gap: 20px;
    padding: 16px 12px 35px 0;
}

.comment-input {
    flex: 1;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 12px;
    font: 400 14px/2 'Noto Sans', sans-serif;
    resize: vertical;
}

.submit-button {
    padding: 4px 8px;
    border-radius: 5px;
    border: none;
    background: none;
    color: #161616;
    font: 400 14px/2 'Noto Sans', sans-serif;
    cursor: pointer;
}

.comment-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
}

.filter-button {
    background: none;
    border: none;
    padding: 0;
    font: 400 14px/2 'Noto Sans', sans-serif;
    color: #161616;
    cursor: pointer;
}

.filter-button.active {
    color: #4299e1;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comment-item {
    display: flex;
    gap: 16px;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 24px;
    object-fit: cover;
}

.comment-content {
    flex: 1;
}

.comment-header {
    gap: 8px;
    align-items: center;
}

.comment-author {
    font: 700 14px/2 'Noto Sans', sans-serif;
    color: #161616;
}

.comment-date {
    font: 400 13px 'Noto Sans', sans-serif;
    color: rgba(113, 128, 150, 0.75);
}

.comment-text {
    margin: 24px 0;
    font: 400 14px/22px 'Noto Sans', sans-serif;
    color: #161616;
}

.comment-actions {
    display: flex;
    gap: 8px;
}

.action-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    padding: 0;
    color: rgba(113, 128, 150, 0.75);
    font: 400 14px/2 'Noto Sans', sans-serif;
    cursor: pointer;
}

.action-icon {
    width: 17px;
    height: 17px;
}

.load-more {
    width: 100%;
    text-align: center;
    padding: 9px 0;
    border-top: 1px solid #e2e8f0;
    background: none;
    border: none;
    color: #161616;
    font: 700 14px/2 'Noto Sans', sans-serif;
    cursor: pointer;
    margin-top: 16px;
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

@media (max-width: 991px) {
    .container {
        padding: 0 20px 100px;
    }

    .articles-row {
        flex-direction: column;
    }

    .comments-section {
        padding: 20px;
    }

    .comment-form {
        flex-direction: column;
    }
}
</style>