<template>
  <div class="bar-item">
    <div class="bar-header">
      <span style="font-size: 16px">区域统计（Top10）</span>
      <span class="caret">
        <i
          class="sort-caret ascending"
          :class="{ active: sort === 'up' }"
          @click="handleSortChange('up')"
        />
        <i
          class="sort-caret descending"
          :class="{ active: sort === 'down' }"
          @click="handleSortChange('down')"
        />
      </span>
      <span style="color: rgba(0, 0, 0, 0.5)">{{ sort === "up" ? "正序" : "逆序" }}</span>
      <el-dropdown placement="bottom-start" style="margin-left: auto" @command="handleCommand">
        <span class="el-dropdown-link active">
          <span class="tag-item">{{ showTag.label }}</span>
          <i class="h-icon-angle_down_sm el-icon--right spec-icon"></i>
        </span>
        <el-dropdown-menu slot="dropdown" ref="dropmenu">
          <el-dropdown-item v-for="it in tagList" :key="it.id" :command="it.id">
            {{ it.label }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="bar-content">
      <barChartContent
        ref="barchartcounter"
        :start-time="startTime"
        :tree-code="treeCode"
        :res-org-id="resOrgId"
        :tab-index="tabIndex"
        :menu-type="menuType"
        :page-type="pageType"
        :cross-type="crossType"
        :sort="sort"
        :indicator-code="showTag.id"
        :unit="unit"
      />
    </div>
  </div>
</template>

<script>
import { commonList, crossHeaderList, faceHeaderList, timHeaderList } from "../util.js";
import barChartContent from "./barChartContent.vue";

export default {
  components: { barChartContent },
  props: {
    startTime: { type: Date },
    treeCode: { type: String, default: "" },
    resOrgId: { type: String, default: "" },
    tabIndex: { type: String, default: "" },
    menuType: { type: String, default: "" },
    pageType: { type: String, default: "" },
    crossType: { type: String, default: "" },
  },
  data() {
    return {
      sort: "up", // up down
      tagList: [],
      showTag: {},
      unit: "%",
    };
  },
  created() {
    this.tagList = this.menuType.startsWith("vehicle")
      ? this.caclList(crossHeaderList)
      : this.menuType.startsWith("face")
      ? this.caclList(faceHeaderList)
      : this.caclList(timHeaderList);
    this.showTag = this.tagList[0];
    this.unit = this.showTag.unit || "%";
  },
  methods: {
    handleSortChange(val) {
      if (val === this.sort) return;
      this.sort = val;
      this.$nextTick(() => {
        this.getVeCapture();
      });
    },
    caclList(list) {
      const arr = [
        {
          label: `${this.pageType === "cross" ? "卡口" : "抓拍机"}数`,
          countprop: "cameraTotalNum",
          id: "cameraNum",
          unit: "num",
        },
        ...commonList,
        ...list,
      ];
      if (this.menuType.startsWith("vehicle") || this.menuType.startsWith("face")) {
        arr.push({
          label: `${this.pageType === "cross" ? "卡口" : "抓拍机"}上报率`,
          prop: "reportDataRate",
          countprop: "reportDataRate",
          filedNum: "unReportData",
          id: "reportCamera",
        });
      } else {
        arr.push({
          label: "违法突变率",
          prop: "vehicleAlarmNormalRate",
          prop: "vehicleAlarmNormalRate",
          filedNum: "vehicleAlarmFailNum",
          id: "vehicleAlarmRate",
        });
      }
      return arr;
    },
    handleCommand(val) {
      if (val === this.showTag.id) return;
      this.showTag = this.tagList.find((v) => v.id === val);
      this.unit = this.showTag.unit || "%";
      this.$nextTick(() => {
        this.getVeCapture();
      });
    },
    getVeCapture() {
      this.$refs.barchartcounter && this.$refs.barchartcounter.getVeCapture();
    },
  },
};
</script>

<style scoped lang="scss">
.bar-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
}
.bar-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 12px 20px;
}
.bar-content {
  flex: 1;
  min-height: 300px;
}
.caret {
  position: relative;
  display: inline-block;
  overflow: initial;
  width: 6px;
  height: 24px;
  margin: 0 9px;
  cursor: pointer;
  vertical-align: middle;
  .sort-caret {
    position: absolute;
    z-index: 2;
    left: 0;
    display: inline-block;
    width: 0;
    height: 0;
    border: 0;
  }
  .ascending {
    top: 5px;
    border-top: none;
    border-right: 3px solid transparent;
    border-bottom: 5px solid #999999;
    border-left: 3px solid transparent;
    &.active {
      border-bottom-color: #1a1a1a;
    }
  }
  .descending {
    bottom: 6px;
    border-top: 5px solid #999999;
    border-right: 3px solid transparent;
    border-bottom: none;
    border-left: 3px solid transparent;
    &.active {
      border-top-color: #1a1a1a;
    }
  }
}
.tag-item {
  padding: 0 12px;
  cursor: pointer;
}
.spec-icon {
  font-size: 24px;
  vertical-align: middle;
  position: relative;
  left: -10px;
  top: -2px;
  cursor: pointer;
}
.active {
  color: rgb(23, 108, 255);
}
</style>
