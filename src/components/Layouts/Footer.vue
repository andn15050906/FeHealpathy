<template>
  <footer>
    <div class="footerContainer">
      <div class="socialIcons">
        <a href=""><i class="fa-brands fa-facebook"></i></a>
        <a href=""><i class="fa-brands fa-instagram"></i></a>
        <a href=""><i class="fa-brands fa-twitter"></i></a>
        <a href=""><i class="fa-brands fa-google-plus"></i></a>
        <a href=""><i class="fa-brands fa-youtube"></i></a>
      </div>
      <div class="footerNav">
        <ul>
          <li><a href="">Home</a></li>
          <li><a href="">News</a></li>
          <li><a href="">About</a></li>
          <li><a href="">Contact Us</a></li>
          <li><a href="">Our Team</a></li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

footer {
  width: 100%;
  background-color: #222;
  padding: 5px 0;
  /*position: fixed;*/
  bottom: 0;
}

.footerContainer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.socialIcons {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}

.socialIcons a {
  text-decoration: none;
  padding: 5px;
  background-color: white;
  margin: 3px;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.socialIcons a i {
  font-size: 1em;
  color: #3db83b;
}

.socialIcons a:hover {
  background-color: #3db83b;
  transition: 0.3s;
}

.socialIcons a:hover i {
  color: white;
}

.footerNav {
  margin-top: 5px;
}

.footerNav ul {
  display: flex;
  justify-content: center;
  list-style-type: none;
}

.footerNav ul li {
  margin: 0 8px;
}

.footerNav ul li a {
  color: white;
  text-decoration: none;
  font-size: 0.9em;
  opacity: 0.7;
}

.footerNav ul li a:hover {
  opacity: 1;
  color: #3db83b;
}
</style>