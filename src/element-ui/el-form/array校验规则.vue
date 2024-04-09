<template>
  <div></div>
</template>

<script>
export default {
  data() {
    return {
      unitFormRules: {
        idList: {
          type: "Array",
          required: true,
          validator: (rule, value, callback) => {
            if (!this.unitFormData.idList?.length) {
              callback(new Error("请选择上级组织"));
              return;
            }
            callback();
          },
          trigger: "change",
        },
      },
      roleIds: [
        {
          type: "Array",
          required: true,
          validator: (rule, value, callback) => {
            if (!this.memberForm.roleIds?.length) {
              callback(new Error("请选择角色"));
              return;
            }
            callback();
          },
          trigger: "change",
        },
      ],
    };
  },
  methods: {
    // 单个更新array的校验，解决特么的校验不更新的问题，只能手动校验了
    updatePhones(val) {
      this.memberForm.phones = val.filter((v) => v.managerPhone).map((v) => v.managerPhone);
      setTimeout(() => {
        this.$refs.memberForm.resetValidate("phones");
      });
    },
  },
};
</script>
