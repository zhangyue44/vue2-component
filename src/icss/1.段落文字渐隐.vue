<template>
  <div class="about w-full h-full">
    <div class="button">Button</div>
    <p>
      <a
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia nostrum placeat
        consequatur deserunt velit ducimus possimus commodi temporibus debitis quam, molestiae
        laboriosam sit repellendus sed sapiente quidem quod accusantium vero.
      </a>
    </p>
  </div>
</template>

<style scoped lang="scss">
p {
  width: 300px;
}
a {
  background: linear-gradient(90deg, #999, #999), linear-gradient(90deg, #fc0, #fc0);
  background-size: 100% 100%, 0 100px;
  background-repeat: no-repeat;
  background-position: 100% 100%, 0 100%;
  color: transparent;
  background-clip: text;
  /* transition: 0.8s all linear; */
}
.button:hover ~ p a {
  transition: 0.8s all linear;
  background-size: 0 100px, 100% 100%;
}
</style>
