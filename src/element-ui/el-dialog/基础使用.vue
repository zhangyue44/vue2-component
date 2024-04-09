<template>
  <el-dialog
    title="移动至目录"
    :visible="visible"
    draggable
    :area="[500, 500]"
    :area="580"
    :before-close="
      () => {
        $emit('update:visible', false);
      }
    "
    @close="diaGroupReset"
  >
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="!moveId" :loading="btnLoading" @click="diaGroupConfirm"
        >确定</el-button
      >
      <el-button @click="diaGroupReset">取消</el-button>
    </span>
  </el-dialog>
</template>

<!-- <SortGroupDialog :visible.sync="sortVisible" @updateMove="updateMove" /> -->
