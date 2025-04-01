<template>
    <div class="container mt-5">
      <div class="text-center mb-4">
        <h1 style="font-weight: bold;">
          Choose your preferred way to experience yoga.
        </h1>
      </div>
      <div class="row">
        <div class="col-md-6 mb-4">
          <router-link to="/yoga/poses" class="card-link">
            <div class="card text-center h-100 shadow-sm hover-scale card-try">
              <div class="card-overlay"></div>
              <div class="card-body d-flex flex-column justify-content-center">
                <h1 class="card-title">Try it Yourself</h1>
                <p class="card-text">
                  Practice yoga exercises on your own with guided instructions.
                </p>
              </div>
            </div>
          </router-link>
        </div>
        <div class="col-md-6 mb-4">
          <router-link to="/yoga/" class="card-link">
            <div class="card text-center h-100 shadow-sm hover-scale card-video">
              <div class="card-overlay"></div>
              <div class="card-body d-flex flex-column justify-content-center">
                <h1 class="card-title">Learn by Video</h1>
                <p class="card-text">
                  Watch step-by-step tutorials to master each pose.
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'YogaIntermediate'
  }
  </script>
  
  <style scoped>
  .hover-scale {
    transition: transform 0.3s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.05);
  }
  
  .card-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .card {
    position: relative;
    min-height: 50vh;
    overflow: hidden;
    color: white;
    border: none;
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
  
  .card-body {
    position: relative;
    z-index: 2;
  }
  
  .card-try {
    background-image: url('https://media.istockphoto.com/id/1341873281/vi/vec-to/t%E1%BA%ADp-h%E1%BB%A3p-c%C3%A1c-t%C6%B0-th%E1%BA%BF-c%E1%BB%A7a-ph%E1%BB%A5-n%E1%BB%AF-v%C3%A0-nam-yoga-b%E1%BB%99-s%C6%B0u-t%E1%BA%ADp-nh%E1%BB%AFng-ng%C6%B0%E1%BB%9Di-%C4%91a-v%C4%83n-h%C3%B3a-t%E1%BA%ADp-yoga-b%E1%BB%8B-c%C3%B4.jpg?s=612x612&w=0&k=20&c=tVml4OcIoexzO1dYewOGz3TVSKTcpVPjp-ilDSzJw-c=');
    background-size: cover;
    background-position: center;
  }
  
  .card-video {
    background-image: url('https://thumbs.dreamstime.com/b/yoga-online-classes-girl-watching-sport-tutorials-laptop-working-out-home-cat-concept-ilustration-isolated-white-181828932.jpg');
    background-size: cover;
    background-position: center;
  }
  
  .card-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  
  .card-text {
    font-size: 1.25rem;
    font-weight: 600;
  }
  </style>
  