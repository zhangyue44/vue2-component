<template>
  <el-dialog
    title="IP填写范围校验规则"
    :visible="visible"
    :area="880"
    top="10%"
    :before-close="
      () => {
        $emit('update:visible', false);
      }
    "
    @close="cancel"
  >
    <el-alert type="info" simple show-icon :closable="false">
      <div slot="title">
        <div style="margin-bottom: 4px">默认校验规则：A段范围是1-255，B、C、D段范围是0-255。</div>
        <div>
          如有特殊校验规则请在下方配置：多个数值请用顿号隔开；连续数值可用连接符-表示，如2-6；空值表示不做特殊校验。
        </div>
      </div>
    </el-alert>
    <div class="header">
      <div class="header-item area">区域</div>
      <div class="header-item">A段</div>
      <div class="header-item">B段</div>
      <div class="header-item">C段</div>
      <div class="header-item">D段</div>
      <div class="header-item noborder">操作</div>
    </div>
    <el-tree
      ref="tableTree"
      v-loading="treeLoading"
      :data="treeData"
      :props="defaultProps"
      :highlight-current="false"
      :expand-on-dbclick-node="false"
      :default-expanded-keys="['root00000000']"
      node-key="regionId"
      class="tree-wrap"
    >
      <div slot-scope="{ node, data, store }" class="custom-tree-node">
        <div class="custom--tree-text" :style="`width:${areaWidth - 24 - (node.level - 1) * 16}px`">
          <span class="label">{{ node.label }}</span>
          <div class="add-item">
            <el-tooltip placement="top" content="新增一行">
              <el-button type="iconButton" icon="h-icon-add" @click="addClick(data)" />
            </el-tooltip>
          </div>
        </div>
        <div class="custom--tree--ip">
          <div v-for="(item, index) in data.ipVOS" :key="item.id" class="ip-container">
            <IpConfigInput v-model="item.asegment" :msg="'asegment'"></IpConfigInput>
            <IpConfigInput v-model="item.bsegment"></IpConfigInput>
            <IpConfigInput v-model="item.csegment"></IpConfigInput>
            <IpConfigInput v-model="item.dsegment"></IpConfigInput>
            <div class="custom--tree--delete">
              <el-button
                type="iconButton"
                icon="h-icon-delete"
                :disabled="data.ipVOS && data.ipVOS.length === 1"
                @click="deleteClick(data, index)"
              />
            </div>
          </div>
        </div>
      </div>
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :loading="submitLoading"
        :disabled="!treeData.length"
        @click="confirm"
      >
        保 存
      </el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getIpForm, saveIpForm } from "@/api/archives.js";
import IpConfigInput from "./IpConfigInput.vue";

export default {
  components: { IpConfigInput },
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      areaWidth: 200,
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: "subRegionIpRangeVOS",
        label: "regionName",
      },
      submitLoading: false,
      pauseValue: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.pauseValue = false;
        this.treeLoading = true;
        getIpForm()
          .then(({ data }) => {
            if (data) this.init([data]);
            this.treeData = data ? [data] : [];
          })
          .finally(() => {
            this.treeLoading = false;
          });
      } else {
        this.submitLoading = false;
        this.treeData = [];
        this.$emit("updateSwitch", this.pauseValue);
      }
    },
  },
  methods: {
    init(data) {
      data.forEach((v) => {
        v.ipVOS.forEach((it) => {
          it.id = new Date().getTime() * Math.random();
        });
        if (v.subRegionIpRangeVOS) this.init(v.subRegionIpRangeVOS);
      });
    },
    addClick(data) {
      data.ipVOS.push({
        asegment: "",
        bsegment: "",
        csegment: "",
        dsegment: "",
        id: new Date().getTime() * Math.random(),
      });
    },
    deleteClick(data, index) {
      data.ipVOS.splice(index, 1);
    },
    async confirm() {
      const nodes = document.querySelectorAll(".ip-config-error");
      if (nodes.length) {
        this.$message.warning("请对比提示规则调整ip填写范围");
        return;
      }
      this.submitLoading = true;
      try {
        await saveIpForm(...this.treeData);
        this.pauseValue = true;
        this.$emit("update:visible", false);
        this.submitLoading = false;
      } catch (err) {
        this.submitLoading = false;
      }
    },
    cancel() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  margin-top: 16px;
  background-color: rgb(240, 240, 240);
  color: rgba(0, 0, 0, 0.9);
  &-item {
    flex: 1;
    padding-left: 12px;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    &.noborder {
      flex: 0 0 80px;
      border: none;
    }
    &.area {
      flex: 0 0 200px;
    }
  }
}
.tree-wrap {
  min-height: 300px;
  max-height: 600px;
  overflow-y: auto;
  ::v-deep .el-tree-node__expand-icon {
    margin-top: 8px;
  }
  ::v-deep .el-tree-node__content {
    display: flex;
    height: auto;
    min-height: 40px;
  }
  ::v-deep .el-button.is-disabled {
    opacity: 1;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    color: #4d4d4d;
    .custom--tree-text {
      position: relative;
      line-height: 40px;
      .add-item {
        position: absolute;
        top: -2px;
        right: 0;
      }
    }
    .custom--tree--ip {
      flex: 1;
      .ip-container {
        display: flex;
        width: 100%;
      }
    }
    .custom--tree--delete {
      flex: 0 0 80px;
      display: flex;
      justify-content: center;
      transform: translateY(4px);
    }
  }
}
</style>
