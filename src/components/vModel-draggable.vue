<template>
  <div>
    <input type="text" :value="value" @input="$emit('input', $event.target.value)" />
    <input type="text" :value="inputValue" @input="inputValue = $event.target.value" />
    <draggable v-model="list" @start="drag = true" @end="drag = false" v-bind="dragOptions">
      <transition-group>
        <div v-for="(item, index) in list" :key="item.id">
          {{ item.value }} <span @click="deleteClick(index)">删除</span>
          <input type="text" value="hssdfs" />
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  props: {
    value: { type: String, default: "" },
  },
  data() {
    return {
      inputValue: "aaaa",
      list: [
        { id: 1, value: "jkasdgjakdg" },
        { id: 2, value: "qweqewrrwer" },
        { id: 3, value: "rttryrtyrty" },
        { id: 4, value: "ghfghfhfgh" },
        { id: 5, value: "dsgfdgdgdsgdsf" },
      ],
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  methods: {
    deleteClick(index) {
      this.list.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped></style>
