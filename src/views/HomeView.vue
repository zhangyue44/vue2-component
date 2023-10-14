<template>
  <div class="home">
    <!-- <comTest v-model="msg"/> -->
    <!-- <comTest :value="msg" @input="msg=$event"/> -->
    <!-- <vModelCheck v-model="boolValue"></vModelCheck> -->
    <!-- <vModelCheck :value="boolValue" @input="boolValue=$event"></vModelCheck> -->

    <!-- <template v-slot:todo="{todo}"> -->
    <!-- <vSlot :todo="todo">
      <template #todo="{todo}">
        {{ todo.text }}
      </template>
    </vSlot> -->

    <!-- <project></project> -->
    <!-- <vTransition></vTransition> -->
    <!-- <vTransitionGroup></vTransitionGroup> -->
    <!-- <vDirective></vDirective> -->
    <!-- <vJSX></vJSX> -->
    <!-- <vObservable></vObservable> -->

    <!-- <vStore></vStore> -->
    <vEventbus v-if="eventbusShow"></vEventbus>
  </div>
</template>

<script>
import { computed } from "vue";
import { EventBus } from "@/EventBus.js";
// import comTest from '@/components/vModel-draggable.vue';
// import vModelCheck from '@/components/vModel-checkout.vue';
// import vSlot from '@/components/vSlot.vue';
// import project from "@/components/provide-inject.vue";
// import vTransition from '@/components/transition.vue';
// import vTransitionGroup from '@/components/transition-group.vue';
// import vDirective from '@/components/vDirective.vue';
// import vJSX from '@/components/vJSX.vue';
// import vObservable from '@/components/vObservable.vue';
// import vStore from "@/components/vStore.vue";
import vEventbus from "@/components/vEventbus.vue";

export default {
  name: "HomeView",
  components: {
    // comTest,
    // vModelCheck,
    // vSlot,
    // project,
    // vTransition,
    // vTransitionGroup,
    // vDirective,
    // vJSX,
    // vObservable,
    // vStore,
    vEventbus,
  },
  provide() {
    return {
      provideValue: this.getProvideValue, // 非响应式
      msg: computed(() => this.msg), // computed函数让provide传递的值变成响应式
    };
  },
  data() {
    return {
      msg: "哈哈",
      boolValue: true,
      todo: { text: "ddd" },
      eventbusShow: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.msg = "嘿嘿嘿";
      this.eventbusShow = false;
      setTimeout(() => {
        EventBus.$emit("test", "aas", "sdsd");
      });
    }, 3000);
  },
  methods: {
    getProvideValue() {
      console.log("ooooooo");
    },
  },
};
</script>
