<template>
  <h-drawer
    show-close
    :modal="false"
    :visible="visible"
    size="900px"
    :wrapper-closable="false"
    @close="cancel"
  ></h-drawer>
</template>

<style scoped lang="scss">
::v-deep .el-drawer__header {
  padding: 10px;
  margin: 0;
}
::v-deep .el-drawer__body {
  overflow: auto;
  padding: 0 10px;
}
</style>
