<template>
  <div class="about w-full h-full">
    <p class="source">请把文字摆放到正确的位置：橘皮乌龙</p>
    <div class="g-container">
      <div class="g-wrap">
        <div class="g-flag"></div>
        <div class="g-box" draggable="true">橘</div>
      </div>
      <div class="g-wrap">
        <div class="g-flag"></div>
        <div class="g-box" draggable="true">皮</div>
      </div>
      <div class="g-wrap">
        <div class="g-flag"></div>
        <div class="g-box" draggable="true">乌</div>
      </div>
      <div class="g-wrap">
        <div class="g-flag"></div>
        <div class="g-box" draggable="true">龙</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@function randomNum($max, $min: 0, $u: 1) {
  @return ($min + random($max)) * $u;
}
@function randomColor() {
  @return rgb(randomNum(255), randomNum(255), randomNum(255));
}
.g-container {
  display: flex;
  width: 400px;
  height: 100px;
}
.g-wrap {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  border: 1px dashed #000;
  box-sizing: border-box;
}
.g-flag {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  background: rgba(0, 0, 0, 0.15);
}
.g-box {
  width: 100%;
  height: 100%;
  background-color: #000;
  cursor: grab;
  color: #fff;
  text-align: center;
  line-height: 100px;
  font-size: 48px;
}
.g-wrap:active .g-flag {
  width: 100%;
  height: 100%;
}
@for $i from 1 to 5 {
  .g-wrap:nth-child(#{$i}) .g-box {
    background: randomColor();
    transform: rotate(#{random(180)}deg) translate(#{random(400) - 150}px, #{random(100) + 60}px);
  }
}
.g-box {
  transition: 99999s 999999s;
}
.g-flag:hover + .g-box {
  transform: translate(0, 0);
  transition: 0s;
}
</style>
