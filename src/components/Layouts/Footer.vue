<template>
  <footer class="footer bg-white pt-2">
    <div class="container text-center p-0">
      <ul class="nav justify-content-center mb-3">
        <li class="nav-item">
          <a class="nav-link text-secondary px-2" href="#"><strong>Home</strong></a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-secondary px-2" href="#"><strong>News</strong></a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-secondary px-2" href="#"><strong>About Us</strong></a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-secondary px-2" href="#"><strong>Contact Us</strong></a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-secondary px-2" href="#"><strong>Our Team</strong></a>
        </li>
      </ul>

      <div class="socialIcons mb-3">
        <a href="#" class="mx-2">
          <i class="fab fa-facebook-f facebook-icon"></i>
        </a>
        <a href="#" class="mx-2">
          <i class="fab fa-linkedin-in linkedin-icon"></i>
        </a>
        <a href="#" class="mx-2">
          <i class="fab fa-instagram instagram-icon"></i>
        </a>
        <a href="#" class="mx-2">
          <i class="fab fa-facebook-messenger messenger-icon"></i>
        </a>
        <a href="#" class="mx-2">
          <i class="fab fa-twitter twitter-icon"></i>
        </a>
      </div>

      <div class="text-secondary py-3">
        © 2025 Healthpathy. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
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