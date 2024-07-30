<template>
  <el-dialog
    title="目录排序"
    :visible="visible"
    :area="580"
    :before-close="
      () => {
        $emit('update:visible', false);
      }
    "
    @close="cancel"
  >
    <el-alert title="拖动目录进行排序，实时生效" type="info" simple show-icon :closable="false" />
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="treeData"
      :node-key="treeDefaultProps.id"
      style="height: 31.25rem; overflow-y: auto"
      move
      :default-expanded-keys="rootId"
      :show-checkbox="selectable"
      :props="treeDefaultProps"
      :before-drop="beforeDrop"
      @node-drag-end="handleNodeDragEnd"
    >
      <span slot-scope="{ node }" class="custom-tree-node">
        <img src="@/assets/tree/icon_folder@build-platform.svg" alt="" class="inline-block" />
        <span>{{ node.label }}</span>
      </span>
    </el-tree>
  </el-dialog>
</template>

<script>
import { getGroupTreeNew, addEditTreeFolder } from "@/api/esurvey/mapNew.js";

export default {
  props: {
    visible: { type: Boolean, default: false },
    selectable: { type: Boolean, default: false },
    treeCode: { type: String, default: "" },
  },
  data() {
    return {
      loading: false,
      treeDefaultProps: { id: "id", label: "name", children: "children" },
      treeData: [],
      moveGroup: false,
      rootId: [],
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getGroupTreeNew();
          this.$refs.tree && this.$refs.tree.setCurrentKey(null);
        } else {
          this.loading = false;
        }
      },
    },
  },
  methods: {
    getGroupTreeNew() {
      this.loading = true;
      getGroupTreeNew({ needNum: 0 }, this.treeCode)
        .then((res) => {
          this.loading = false;
          this.rootId = res.data[0] ? [res.data[0].id] : [];
          this.treeData = res.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    beforeDrop(data, node, targetNode, movePosition) {
      if (targetNode?.data?.id === this.rootId[0] && movePosition !== "inner") {
        return false;
      }
      return true;
    },
    handleNodeDragEnd(e, data, node1, node2) {
      if (!node2 || node1 === node2) return;
      setTimeout(() => {
        const target = this.$refs.tree.getNode(data.id);
        const parentId = target.parent.data.id;
        const sortIdx = target.parent.data.children.findIndex((v) => v.id === data.id);
        const obj = {
          id: data.id,
          name: data.name,
          parentId,
          sortIdx,
        };
        addEditTreeFolder(obj).then((res) => {
          this.moveGroup = true;
          this.$message({
            type: "success",
            message: "目录拖动成功",
          });
        });
      });
    },
    cancel() {
      if (this.moveGroup) {
        this.$emit("updateMove");
      }
      this.moveGroup = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  vertical-align: middle;
}
</style>
