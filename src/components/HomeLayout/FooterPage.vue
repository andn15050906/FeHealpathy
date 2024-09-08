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

body {
    margin-bottom: 100px; /* Tạo khoảng trống cho footer */
}

footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #111;
}

.footerContainer {
    width: 100%;
    padding: 10px;
    margin: 0;
}

.socialIcons {
    display: flex;
    justify-content: center;
}

.socialIcons a {
    text-decoration: none;
    padding: 5px;
    background-color: white;
    margin: 5px;
    border-radius: 50%;
}

.socialIcons a i {
    font-size: 2em;
    color: black;
    opacity: 0.9;
}

.socialIcons a:hover {
    background-color: #111;
    transition: 0.5s;
}

.socialIcons a:hover i {
    color: white;
    transition: 0.5s;
}

.footerNav {
    margin: 20px 0;
}

.footerNav ul {
    display: flex;
    justify-content: center;
    list-style-type: none;
}

.footerNav ul li a {
    color: white;
    margin: 20px;
    text-decoration: none;
    font-size: 1.3em;
    opacity: 0.7;
    transition: 0.5s;
}

.footerNav ul li a:hover {
    opacity: 1;
}
</style>
