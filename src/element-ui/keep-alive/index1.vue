<template>
  <div class="page-wrapper">
    <div class="safeHeader">
      <van-nav-bar title="申请管理" left-arrow @click-left="handleReturnGo" />
    </div>
    <div class="safeContent">
      <div style="flex-shrink: 0">
        <van-search
          v-model.trim="search"
          show-action
          placeholder="事由"
          @clear="
            () => {
              search = '';
              init();
            }
          "
        >
          <template #action>
            <div @click="init">搜索</div>
          </template>
        </van-search>
        <van-tabs v-model="listType" title-active-color="#FF844B" @click="onClick">
          <van-tab :title="`代办(${showTotal})`" name="todo" />
          <van-tab title="已办" name="done" />
          <van-tab title="已发起" name="created" />
        </van-tabs>
        <van-dropdown-menu active-color="#FF844B">
          <van-dropdown-item v-model="type" :options="option1" @change="handleSearchChange" />
          <van-dropdown-item v-model="sort" :options="option2" @change="onClick" />
        </van-dropdown-menu>
      </div>
      <div class="pull-list">
        <recordPullList
          ref="recordlist"
          :search="search"
          :listType="listType"
          :type="type"
          :sort="sort"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getToNum } from "@/mobile/api/application.js";
import mixin from "./mixin.js";
import recordPullList from "./component/recordPullList.vue";

export default {
  components: { recordPullList },
  mixins: [mixin],
  data() {
    return {
      isFirst: true,
      showTotal: 0,
      search: "",
      listType: "todo",
      type: "",
      sort: "0",
      option1: [
        { text: "全部代办", value: "" },
        { text: "请假", value: "leave" },
        { text: "补卡", value: "correct" },
      ],
      option2: [
        { text: "最新到达优先", value: "0" },
        { text: "最早到达优先", value: "1" },
      ],
    };
  },
  activated() {
    // 首次进入页面也会调用activated 调用顺序 created -> activated -> mounted
    // keep-alive 没有缓存滚动条信息，想缓存滚动信息，需通过beforeRouteLeave 缓存位置信息，再通过beforeRouteEnter 更新位置信息
    this.getToNum();
    if (this.isFirst) {
      this.isFirst = false;
    } else {
      this.init();
    }
  },
  deactivated() {
    // 跳转到不需要缓存此组件的路由时，重置数据
    if (this.$route.name === "application") {
      this.search = "";
      this.type = "";
      this.sort = "0";
      this.listType = "todo";
    }
  },
  methods: {
    getToNum() {
      getToNum().then(({ data }) => {
        this.showTotal = (data || []).reduce((pre, cur) => pre + cur.count, 0);
      });
    },
    init() {
      this.$refs.recordlist.onRefresh();
    },
    onClick(val) {
      this.$nextTick(() => {
        this.init();
      });
    },
    handleSearchChange(val) {
      this.$nextTick(() => {
        this.init();
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "./common.scss";

.safeContent {
  overflow-y: hidden !important;
  display: flex;
  flex-direction: column;
  .pull-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
}
::v-deep .van-tabs__line {
  background-color: #ff844b;
}
</style>
