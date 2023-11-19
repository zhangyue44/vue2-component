<template>
  <div class="h-full w-full bg-black flex aBox overflow-hidden">
    <div v-for="item in 50" :key="item" class="a"></div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:string";
$str: "QWERTYUIOPASDFGHJKLZXCVBNMabcdefghigklmnopqrstuvwxyz123456789";
$length: str-length($str);
$size: 24;
$count: 41;
@function randomColor() {
  @return rgb(random(255), random(255), random(255));
}
@function randomLinear($count) {
  $value: "";
  @for $i from 0 through ($count - 1) {
    $value: $value + randomColor() + string.unquote(" 0 #{$i * 32}px,");
  }
  @return linear-gradient(string.unquote(#{$value}) randomColor() 0 100%);
}
@function randomChar() {
  $r: random($length);
  @return str-slice($str, $r, $r);
}

@function randomChars($number) {
  $value: "";
  @if $number > 0 {
    @for $i from 1 through $number {
      $value: $value + randomChar();
    }
  }
  @return $value;
}
.aBox {
  animation: colorChange 1s steps(12) infinite;
}
.a {
  font-family: monospace;
  position: relative;
  width: #{$size}px;
  height: 100%;
  flex-shrink: 0;
  &::before {
    position: absolute;
    font-family: monospace;
    text-align: center;
    font-size: 32px;
    width: #{$size}px;
    line-height: 32px;
    word-break: break-all;
    color: transparent;
  }
}
@for $i from 1 to $count {
  .a:nth-child(#{$i}) {
    &::before {
      content: randomChars(32);
      --content1: "#{randomChars(32)}";
      --content2: "#{randomChars(32)}";
      --content3: "#{randomChars(32)}";
      --content4: "#{randomChars(32)}";
      background: randomLinear(32);
      background-clip: text;
      animation: contentChange 1s infinite;
    }
  }
}
@keyframes colorChange {
  100% {
    filter: hue-rotate(360deg);
  }
}
@keyframes contentChange {
  20% {
    content: var(--content1);
  }
  40% {
    content: var(--content2);
  }
  60% {
    content: var(--content3);
  }
  80% {
    content: var(--content4);
  }
}
</style>
