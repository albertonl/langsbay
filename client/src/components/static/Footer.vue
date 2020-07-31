<template>
  <!-- Regular Footer -->
  <footer class="page-footer font-small mt-5">
    <div class="text-center">
      <a href="/"><img class="mb-3" src="/static/learning/img/logo-dark.png" height="75"></a>
      <div class="row">
        <div class="col-md-12 py-2">
          <div class="mb-1 flex-center">
            <!-- Email -->
            <a class="em-ic" href="mailto:albertonl.dev@gmail.com" target="_blank"><i class="fas fa-envelope fa-lg mx-3 fa-2x"></i></a>
            <!-- Twitter -->
            <a class="tw-ic" href="https://youtu.be/dQw4w9WgXcQ" target="_blank"><i class="fab fa-twitter fa-lg mx-3 fa-2x"></i></a>
            <!-- Instagram -->
            <a class="ins-ic" href="https://youtu.be/dQw4w9WgXcQ" target="_blank"><i class="fab fa-instagram fa-lg mx-3 fa-2x"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-copyright text-center py-3 white-text">
        &copy; Copyright 2020: <a href="/">Langsbay</a>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'langsbayFooter',
    props: {
      footerClass: String
    }
  }
</script>

<style>
  footer:not(.footer-original), footer:not(.footer-modif) {
    background-color: #dbd56e;
    overflow: hidden;
    width: 100%;
  }

  .footer-original {
    background-color: #dbd56e;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 190px;
    width: 100%;
    overflow: hidden;
  }

  .footer-modif {
    background-color: #dbd56e;
    clear: both;
    position: absolute;
    height: 190px;
    width: 100%;
    margin-top: -190px;
  }

  .em-ic, .tw-ic, .ins-ic {
    color: #454545;
  }

  .em-ic:hover, .tw-ic:hover, .ins-ic:hover {
    color: #333;
  }

  .footer-copyright {
    background-color: #454545;
  }

  .footer-copyright a {
    color: #dbd56e;
  }

  .footer-copyright a:hover {
    color: #dbd56e;
    text-decoration: underline;
  }
</style>
