<template>
  <div class="centerPage">
    <div class="title">标签项</div>
    <el-input
      placeholder="搜索关键字"
      v-model.trim="keyWord"
      class="filter-tree-input"
      suffix-icon="h-icon-search"
      clearable
      style="padding: 0px 6px"
      :on-icon-click="handleIconClick"
      @keyup.enter.native="handleIconClick"
      @clear="
        () => {
          keyWord = '';
          handleIconClick();
        }
      "
    />
    <div class="tree-wrap">
      <el-tree
        ref="tree"
        node-key="code"
        style="height: 100%"
        :data="treeData"
        :props="defaultProps"
        :expand-on-dbclick-node="false"
        :filter-node-method="filterNode"
        default-expand-all
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-checkbox
            v-model="data._isExpand"
            style="vertical-align: middle"
            @change="checkChange(data)"
          ></el-checkbox>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import { getManageTree } from "@/api/tag.js";

export default {
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      treeData: [],
      keyWord: "",
      defaultProps: { label: "name" },
      formData: {
        parentCode: "",
        categoryCode: "",
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getManageTree();
        } else {
          this.treeData = [];
          this.keyWord = "";
          this.formData = {
            parentCode: "",
            categoryCode: "",
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getManageTree() {
      getManageTree(this.formData)
        .then(({ data }) => {
          this.treeData = data || [];
        })
        .catch((err) => {
          this.treeData = [];
          console.log(err);
        });
    },
    handleIconClick() {
      this.$refs.tree.filter(this.keyWord, !this.keyWord);
    },
    updateList(curNode) {
      this.formData.categoryCode = curNode.categoryCode;
      this.getManageTree();
    },
    checkChange(data) {
      this.$emit("checkChange", { ...data });
    },
  },
};
</script>

<style scoped lang="scss">
.centerPage {
  width: 30%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #ccc;
  margin-left: -1px;
  .title {
    height: 48px;
    line-height: 48px;
    background-color: #f5f5f5;
    color: rgba(0, 0, 0, 0.9);
    padding-left: 12px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
}
.tree-wrap {
  flex: 1;
  padding: 0px 6px;
  overflow: hidden;
}
.custom-tree-node {
  color: rgba(0, 0, 0, 0.7);
  vertical-align: middle;
}
.el-tree--highlight-current
  .el-tree-node.is-current:not(.is-drag)
  > .el-tree-node__content
  .custom-tree-node {
  color: #fff;
}
</style>
