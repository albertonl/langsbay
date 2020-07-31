<template>
  <!-- Regular Navbar -->
  <div class="navbar">
    <div class="logo-top">
      <a href="/">
        <img src="/static/learning/img/logo-dark.svg">
      </a>
    </div>
    <div class="burger"><span></span></div>
    <nav>
      <ul class="main">
        <li>
          <a href="/">
            <img class="mb-2" src="/static/learning/img/logo-light-noship.png" width="250">
          </a>
        </li>
        <div v-if="noauth">
          <li><a href="/">Home</a></li>
          <li><a href="/#features">Features</a></li>
          <li><a href="/#pricing">Pricing</a></li>
          <li><a href="mailto:albertonl.dev@gmail.com">Contact</a></li>
          <li><a href="/accounts/login/" class="btn btn-primary btn-block">Log in</a></li>
        </div>
        <div v-else>
          <li><a href="/browse/">Home</a></li>
          <li><a href="/dictionary/">Dictionary</a></li>
          <li><a v-bind:href="'u' + username + '/'">My profile</a></li>
          <li><a href="/accounts/logout/" class="btn btn-secondary btn-block">Log out</a></li>
        </div>
      </ul>

      <div class="about">
        <p>No, you don't need expensive textbooks. Learning a language can be easy.</p>
      </div>

      <div class="social">
        <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64">
            <g transform="translate(0, 0)">
              <path d="M64,12.2c-2.4,1-4.9,1.8-7.5,2.1c2.7-1.6,4.8-4.2,5.8-7.3c-2.5,1.5-5.3,2.6-8.3,3.2C51.5,7.6,48.1,6,44.3,6 c-7.3,0-13.1,5.9-13.1,13.1c0,1,0.1,2,0.3,3C20.6,21.6,10.9,16.3,4.5,8.4c-1.1,1.9-1.8,4.2-1.8,6.6c0,4.6,2.3,8.6,5.8,10.9 c-2.2-0.1-4.2-0.7-5.9-1.6c0,0.1,0,0.1,0,0.2c0,6.4,4.5,11.7,10.5,12.9c-1.1,0.3-2.3,0.5-3.5,0.5c-0.8,0-1.7-0.1-2.5-0.2 c1.7,5.2,6.5,9,12.3,9.1c-4.5,3.5-10.2,5.6-16.3,5.6c-1.1,0-2.1-0.1-3.1-0.2C5.8,55.8,12.7,58,20.1,58c24.2,0,37.4-20,37.4-37.4 c0-0.6,0-1.1,0-1.7C60,17.1,62.2,14.8,64,12.2z">
              </path>
            </g>
          </svg>
        </a>
        <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64">
            <g transform="translate(0, 0)">
              <path d="M32,5.766c8.544,0,9.556,0.033,12.931,0.187c3.642,0.166,7.021,0.895,9.621,3.496 c2.6,2.6,3.329,5.979,3.496,9.621c0.154,3.374,0.187,4.386,0.187,12.931s-0.033,9.556-0.187,12.931 c-0.166,3.642-0.895,7.021-3.496,9.621c-2.6,2.6-5.98,3.329-9.621,3.496c-3.374,0.154-4.386,0.187-12.931,0.187 s-9.557-0.033-12.931-0.187c-3.642-0.166-7.021-0.895-9.621-3.496c-2.6-2.6-3.329-5.979-3.496-9.621 C5.798,41.556,5.766,40.544,5.766,32s0.033-9.556,0.187-12.931c0.166-3.642,0.895-7.021,3.496-9.621 c2.6-2.6,5.979-3.329,9.621-3.496C22.444,5.798,23.456,5.766,32,5.766 M32,0c-8.691,0-9.78,0.037-13.194,0.193 c-5.2,0.237-9.768,1.511-13.436,5.178C1.705,9.037,0.43,13.604,0.193,18.806C0.037,22.22,0,23.309,0,32 c0,8.691,0.037,9.78,0.193,13.194c0.237,5.2,1.511,9.768,5.178,13.436c3.666,3.666,8.234,4.941,13.436,5.178 C22.22,63.963,23.309,64,32,64s9.78-0.037,13.194-0.193c5.199-0.237,9.768-1.511,13.436-5.178c3.666-3.666,4.941-8.234,5.178-13.436 C63.963,41.78,64,40.691,64,32s-0.037-9.78-0.193-13.194c-0.237-5.2-1.511-9.768-5.178-13.436 c-3.666-3.666-8.234-4.941-13.436-5.178C41.78,0.037,40.691,0,32,0L32,0z">
              </path>
              <path data-color="color-2" d="M32,15.568c-9.075,0-16.432,7.357-16.432,16.432c0,9.075,7.357,16.432,16.432,16.432 S48.432,41.075,48.432,32C48.432,22.925,41.075,15.568,32,15.568z M32,42.667c-5.891,0-10.667-4.776-10.667-10.667 c0-5.891,4.776-10.667,10.667-10.667c5.891,0,10.667,4.776,10.667,10.667C42.667,37.891,37.891,42.667,32,42.667z">
              </path>
              <circle data-color="color-2" cx="49.082" cy="14.918" r="3.84">
              </circle>
            </g>
          </svg>
        </a>
      </div>
      <ul class="sub">
        <li><a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">Terms &amp; Conditions</a></li>
        <li><a href="https://youtu.be/dQw4w9WgXcQ" target="_blank">Privacy Policy</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
  export default {
    name: 'langsbayNavbar',
    props: {
      noauth: Boolean,
      username: String
    }
  }


  /* eslint-disable */
  // We disable eslint here to avoid «'$' is not defined»
  // errors, as jQuery is loaded later on from a CDN.
  document.addEventListener('DOMContentLoaded', () => {
    $('.burger, .overlay').click(function () {
      $('.burger').toggleClass('clicked');
      if (document.querySelector('.burger').classList.contains('clicked')) {
        document.querySelector('.burger').style.background = "transparent";
      } else {
        setTimeout(() => {
          document.querySelector('.burger').style.background = "#9fc2cc";
        }, 400);
      }
      $('.overlay').toggleClass('show');
      $('nav').toggleClass('show');
      $('body').toggleClass('overflow');

      setTimeout(() => {
        let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        if (width <= 700) $('.logo-top').toggle();
      }, 250);
    });
  });
  /* eslint-enable */
</script>

<style lang="scss">
  @import 'https://fonts.googleapis.com/css?family=Raleway|Spectral';

  /*  _burgers.scss
  ========================================== */
  // Burger parts
  //
  // (---) top    -> &::before
  // [---] middle -> &
  // (---) bottom -> &::after


  // Vendor prefixes
  $sass-burger-add-vendor-prefixes: true !default;

  // Burger
  @mixin burger($width: 30px, $height: 5px, $gutter: 3px, $color: #000, $border-radius: 0, $transition-duration: .3s) {
      $burger-height: $height !global;
      $burger-gutter: $gutter !global;

      position: relative;
      margin-top: $height + $gutter;
      margin-bottom: $height + $gutter;

      @if $sass-burger-add-vendor-prefixes {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
      }
      user-select: none;

      // 1. Fixes jagged edges in Firefox, see issue #10.
      &, &::before, &::after {
          display: block;
          width: $width;
          height: $height;
          background-color: $color;
          outline: 1px solid transparent; // 1
          @if $border-radius != 0 {
              border-radius: $border-radius;
          }

          @if $sass-burger-add-vendor-prefixes {
              -webkit-transition-property: background-color, -webkit-transform;
              -moz-transition-property: background-color, -moz-transform;
              -o-transition-property: background-color, -o-transform;
          }
          transition-property: background-color, transform;

          @if $sass-burger-add-vendor-prefixes {
              -webkit-transition-duration: $transition-duration;
              -moz-transition-duration: $transition-duration;
              -o-transition-duration: $transition-duration;
          }
          transition-duration: $transition-duration;
      }

      &::before, &::after {
          position: absolute;
          content: "";
      }

      &::before {
          top: -($height + $gutter);
      }

      &::after {
          top: $height + $gutter;
      }
  }


  // Select parts of the burger
  @mixin burger-parts {
      &, &::before, &::after {
          @content;
      }
  }

  @mixin burger-top {
      &::before {
          @content;
      }
  }

  @mixin burger-middle {
      & {
          @content;
      }
  }

  @mixin burger-bottom {
      &::after {
          @content;
      }
  }


  // Burger animations
  @mixin burger-to-cross($color: auto) {
      & {
          background-color: transparent;
      }
      @if ($color != auto) {
          &::before, &::after {
              background-color: $color;
          }
      }
      &::before {
          @if $sass-burger-add-vendor-prefixes {
              -webkit-transform: translateY($burger-gutter + $burger-height) rotate(45deg);
              -moz-transform: translateY($burger-gutter + $burger-height) rotate(45deg);
              -ms-transform: translateY($burger-gutter + $burger-height) rotate(45deg);
              -o-transform: translateY($burger-gutter + $burger-height) rotate(45deg);
          }
          transform: translateY($burger-gutter + $burger-height) rotate(45deg);
      }
      &::after {
          @if $sass-burger-add-vendor-prefixes {
              -webkit-transform: translateY(-($burger-gutter + $burger-height)) rotate(-45deg);
              -moz-transform: translateY(-($burger-gutter + $burger-height)) rotate(-45deg);
              -ms-transform: translateY(-($burger-gutter + $burger-height)) rotate(-45deg);
              -o-transform: translateY(-($burger-gutter + $burger-height)) rotate(-45deg);
          }
          transform: translateY(-($burger-gutter + $burger-height)) rotate(-45deg);
      }
  }

  /*  COLORS
  ========================================== */
  $black: #000000;
  $white: #ffffff;
  $gray: #2a2a2a;
  $gold: #b7ac7f;

  /*  FONTS
  ========================================== */

  $raleway: 'Raleway', sans-serif;
  $spectral: 'Spectral', serif;


  /*  MIXINS
  ========================================== */

  @mixin transform($transform) {
    -webkit-transform: $transform;
       -moz-transform: $transform;
        -ms-transform: $transform;
         -o-transform: $transform;
            transform: $transform;
  }

  @mixin transition($transition) {
    -webkit-transition: #{$transition};
       -moz-transition: #{$transition};
         -o-transition: #{$transition};
            transition: #{$transition};
  }

  @mixin transition-delay($transition-delay) {
    -webkit-transition-delay: #{$transition-delay};
       -moz-transition-delay: #{$transition-delay};
         -o-transition-delay: #{$transition-delay};
            transition-delay: #{$transition-delay};
  }

  /*  RESET
  ========================================== */

  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    width: 100%;
    height: 100%;

    &.overflow {
      overflow: hidden;
    }
  }

  /*  LOGO
  ========================================== */

  @media only screen and (max-device-width: 768px) {
    html {
      height: calc(100% + 60px);
      min-height: calc(100% + 60px);
    }
  }

  .navbar {
    background-color: #9fc2cc;
  }

  .logo-top {
    top: 10px;
    left: 10px;
    z-index: 10;

    img {
      height: 75px;
      padding-left: 15px;
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }

  /*  BURGER
  ========================================== */

  .burger {
    display: inline;
    background-color: #9fc2cc;
    width: 50px;
    height: 50px;
    position: fixed;
    top: 20px;
    right: 20px;
    border-radius: 4px;
    z-index: 10;

    span {
      @include burger(30px, 3px, 6px, $gray); // gray
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -15px;
      margin-top: -1.5px;
    }

    &.clicked {
      span {
        @include burger-to-cross;

        &:before, &:after {
          background-color: $white;
        }
      }
    }

    &:hover {
      cursor: pointer;
    }
  }


  /*  NAV
  ========================================== */

  .navbar {
    overflow-y: hidden;
  }

  nav {
    background-color: $gray;
    position: fixed;
    z-index: 9;
    top: 0;
    right: 0;
    height: 100%;
    max-width: 515px;
    width: 100%;
    padding: 100px 40px 60px 40px;
    overflow-y: scroll;
    @include transform(translateX(100%));
    @include transition(transform .55s cubic-bezier(0.785, 0.135, 0.15, 0.86));

    &.show {
      @include transform(translateX(0px));

      ul.main {
        li {
          @include transform(translateX(0px));
          opacity: 1;

          @for $i from 1 to 10 {
            &:nth-child(#{$i}) {
              transition-delay: $i * 0.15s;
            }
          }
        }
      }

      .about, .social, ul.sub {
        @include transform(translateY(0px));
        opacity: 1;
        transition-delay: .85s;
      }
    }

    @media (min-width: 667px) {
      padding: 120px 90px 70px 90px;
    }

    ul.main {
      list-style-type: none;

      li {
        margin-bottom: 20px;
        @include transform(translateX(40px));
        opacity: 0;
        @include transition(all .3s ease);

        &:last-of-type {
          margin-bottom: 0px;
        }

        a {
          color: $white;
          font-family: $raleway;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 1.5rem;
          display: block;
          letter-spacing: 5px;
          font-weight: 600;
          padding: 10px 0;
          @include transition(all .3s ease);

          span {
            color: $gold;
          }

          &:hover {
            color: $gold;
          }
        }
      }
    }

    .about {
      margin-top: 40px;
      @include transform(translateY(30px));
      opacity: 0;
      @include transition(all .4s ease);

      p {
        color: $white;
        font-family: $spectral;
        font-size: 1.05rem;
        letter-spacing: 0.5px;
        line-height: 170%;
      }
    }

    .social {
      margin-top: 40px;
      position: relative;
      padding-bottom: 30px;
      @include transform(translateY(30px));
      opacity: 0;
      @include transition(all .4s ease);

      &:after {
        content: "";
        width: 230px;
        height: 2px;
        background-color: $gold;
        position: absolute;
        bottom: 0;
        left: 0;
      }

      a {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 25px;

        &:last-of-type {
          margin-right: 0px;
        }

        &:hover {
          svg {
            path, circle {
              fill: $gold;
            }
          }
        }

        svg {
          width: 100%;
          height: 100%;

          path, circle {
            fill: $white;
            @include transition(all .3s ease);
          }
        }
      }
    }

    ul.sub {
      list-style-type: none;
      margin-top: 40px;
      @include transform(translateY(30px));
      opacity: 0;
      @include transition(all .4s ease);

      li {
        margin-bottom: 10px;

        &:last-of-type {
          margin-bottom: 0px;
        }

        a {
          color: $white;
          font-family: $raleway;
          letter-spacing: 1px;
          font-size: 0.9rem;
          text-decoration: none;
          @include transition(all .3s ease);

          &:hover {
            color: $gold;
          }
        }
      }
    }
  }


  /*  OVERLAY
  ========================================== */

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height:100%;
    @include transition(all 0.3s ease-in-out);
    background-color: $gold;
    opacity: 0;
    visibility: hidden;

    &.show {
      opacity: 0.8;
      visibility: visible;
    }
  }
</style>
