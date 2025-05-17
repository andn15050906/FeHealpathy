<template>
  <footer class="footer bg-white pt-2">
    <div class="container text-center p-0">
      <!--hovered-link instead of text-secondary-->
      <ul class="nav justify-content-center mb-3">
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="#"><strong>Trang Chủ</strong></a>
        </li>
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="/practice"><strong>Công cụ</strong></a>
        </li>
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="/blogs"><strong>Bài viết</strong></a>
        </li>
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="/courses"><strong>Khoá học</strong></a>
        </li>
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="/chat"><strong>Cộng đồng</strong></a>
        </li>
        <li class="nav-item hovered-link">
          <a class="nav-link px-2" href="/faq"><strong>Câu hỏi thường gặp</strong></a>
        </li>
      </ul>

      <div class="hovered-link py-3">
        © 2025 Healpathy. Tất cả quyền được bảo lưu.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.hovered-link {
  color: #000;
}

.hovered-link:hover {
  opacity: 1;
  color: #3db83b;
}

.nav-link {
  font-weight: 400;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #000 !important;
}

.socialIcons i {
  font-size: 1.25rem;
  transition: transform 0.2s, color 0.2s;
  color: #6c757d;
}

.socialIcons i:hover {
  transform: scale(1.1);
  color: #000;
}

.facebook-icon {
  color: #3b5998;
}

.linkedin-icon {
  color: #0077b5;
}

.instagram-icon {
  color: #e4405f;
}

.messenger-icon {
  color: #0084ff;
}

.twitter-icon {
  color: #1da1f2;
}

.facebook-icon:hover {
  color: #2d4373;
}

.linkedin-icon:hover {
  color: #005582;
}

.instagram-icon:hover {
  color: #b63050;
}

.messenger-icon:hover {
  color: #006fe0;
}

.twitter-icon:hover {
  color: #1487c9;
}
</style>