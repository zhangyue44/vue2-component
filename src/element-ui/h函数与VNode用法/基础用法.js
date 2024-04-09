import MapImportFil from './MapImportFil'
onSuccess(res) {
  const h = this.$createElement;
  if (res.code === '000000') {
    this.$emit('importVictory');
  } else if (res.code === '1036') {
    this.$msgbox({
      type: 'error',
      title: '导入失败,请检查表格字段完整性',
      message: h(MapImportFil, {
        props: { // 数据源
          msg: res.message,
        },
      }),
    });
  } else {
    this.$msgbox({
      type: 'error',
      title: '导入失败',
      message: res.message,
    });
  }
}


renderMethod(h, { column }) {
  const that = this;
  return h(
    TableHeaderFilter,
    {
      props: {
        filters: column.filteredValue,
        title: column.label,
      },
      on: { // 就是组件内部使用this.$emit()抛出事件，在on中接收处理
        filterChange(selectId) {
          that.searchObj.status = selectId || '10,20,30,80';
          that.refresh();
        },
      },
    },
  );
},
confirm(item) {
  if (this.currentTagId !== item.id) {
    this.currentTagId = item.id;
  } else {
    this.currentTagId = '';
  }
  this.$emit('filterChange', this.currentTagId);
  this.visible = false;
  this.filterActived = Boolean(this.currentTagId);
},
