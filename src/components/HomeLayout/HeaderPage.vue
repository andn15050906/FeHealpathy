<template>
    <div class="header">
        <div class="navbar">
            <div class="logo">
                <router-link class="text-dark" to="/"><img src="../../../public/assets/images/logo.png"></router-link>
            </div>
            <div class="menu">
                <ul>
                    <li><router-link class="text-dark" to="/">Home</router-link></li>
                    <li>Courses</li>
                    <li>Blog</li>
                    <li>Group</li>
                    <li>Contact</li>
                </ul>
            </div>
            <router-link to="/sign-in"><div class="text-dark login-btn">Login</div></router-link>
        </div>   
    </div>
</template>
<style scoped>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Nunito', sans-serif;
}

a{
    text-decoration: none;
}

ul{
    list-style: none;
}

.header{
    width: 100%;
    height: 80px;
    background-color: #fff;
    position: fixed;
    top: 0;
}

.header .navbar{
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    margin-top: 30px;
}

.logo img{
    margin-left: 100px;
}

.menu ul li{
    display: inline-block;
    padding: 0 25px;
    cursor: pointer;
    font-size: 19px;
    font-weight: 700;
    line-height: 80px;
    align-items: center;
}

.login-btn{
    display: block;
    font-size: 19px;
    font-weight: 700;
    cursor: pointer;
    border-radius: 30px;
    background-color: #f3ef51;
    padding: 8px 40px;
    margin-right: 100px;
}
</style>