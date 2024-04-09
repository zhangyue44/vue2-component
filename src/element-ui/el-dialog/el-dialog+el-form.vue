<template>
  <el-dialog
    :visible="visible"
    :title="`${editForm.code ? '编辑' : '添加'}标签项`"
    :before-close="
      () => {
        $emit('update:visible', false);
      }
    "
    :area="480"
    @close="diaGroupReset"
  >
    <el-form
      ref="form"
      label-position="top"
      :model="form"
      :rules="rules"
      label-width="90px"
      style="padding: 0 16px"
    >
      <el-form-item label="标签项名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入标签项名称"></el-input>
      </el-form-item>
      <el-form-item label="键(key)" prop="code">
        <el-input
          v-model.trim="form.code"
          placeholder="请输入"
          :disabled="!!editForm.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="值(value)" prop="value">
        <el-input v-model.trim="form.value" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属标签分类" prop="categoryCode">
        <h-tree-select
          v-model="form.categoryCode"
          :treeData="categoryList"
          node-key="categoryCode"
          placeholder="请选择所属标签分类"
          :props="{ label: 'categoryName' }"
          :show-search="false"
          :filter="false"
          :clearable="false"
          @node-click="cateCodeClick"
        />
      </el-form-item>
      <el-form-item label="所属标签项">
        <h-tree-select
          v-model="form.parentCode"
          ref="parentRef"
          :treeData="manageList"
          node-key="code"
          placeholder="请选择所属标签项"
          :props="{ label: 'name' }"
          :show-search="false"
          :filter="false"
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model.trim="form.desc" placeholder="请输入" type="textarea" :rows="3">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="diaGroupConfirm"> 确定 </el-button>
      <el-button @click="diaGroupReset">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getManageTree, addManage, updateManage } from "@/api/tag.js";
import EventBus from "@/eventBus.js";

export default {
  props: {
    visible: { type: Boolean, default: false },
    categoryList: { type: Array, default: () => [] },
    editForm: { type: Object, default: () => ({}) },
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入标签分类编码"));
      } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
        callback(new Error("仅限英文、数字、下划线"));
      } else if (value.length < 8 || value.length > 32) {
        callback(new Error("长度限制8-32位"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        code: "",
        value: "",
        categoryCode: "",
        parentCode: "",
        desc: "",
      },
      rules: {
        name: [{ required: true, message: "请输入标签项名称", trigger: "blur" }],
        code: [{ required: true, validator: validatePass, trigger: "blur" }],
        value: [{ required: true, message: "请输入值", trigger: "blur" }],
        categoryCode: [{ required: true, message: "请选择所属标签分类", trigger: "change" }],
      },
      manageList: [],
      btnLoading: false,
    };
  },
  watch: {
    visible(val) {
      if (val) Object.assign(this.form, this.editForm);
    },
    "form.categoryCode": function (val) {
      if (val) {
        this.getManageTree();
      } else {
        this.manageList = [];
      }
    },
  },
  methods: {
    getManageTree() {
      getManageTree({ parentCode: "", categoryCode: this.form.categoryCode })
        .then(({ data }) => {
          if (this.editForm.code) this.calcData(data);
          this.manageList = data || [];
          setTimeout(() => {
            this.$refs.parentRef.setValue();
          });
        })
        .catch((err) => {
          this.manageList = [];
          console.log(err);
        });
    },
    calcData(data) {
      data.forEach((item, index) => {
        if (item.code === this.editForm.code) {
          return data.splice(index, 1);
        }
        if (item.children) {
          return this.calcData(item.children);
        }
      });
    },
    diaGroupConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          const responseInterface = this.editForm.code ? updateManage : addManage;
          responseInterface(this.form)
            .then((res) => {
              this.$emit("updateTable");
              if (
                !this.editForm.code ||
                (this.editForm.code && this.editForm.categoryCode !== this.form.categoryCode)
              )
                EventBus.$emit("updateCategory");
              this.diaGroupReset();
            })
            .finally(() => {
              this.btnLoading = false;
            });
        }
      });
    },
    diaGroupReset() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
      this.form = {
        name: "",
        code: "",
        value: "",
        categoryCode: "",
        parentCode: "",
        desc: "",
      };
    },
    cateCodeClick() {
      this.$nextTick(() => {
        this.$refs.form.validateField("categoryCode");
      });
    },
  },
};
</script>
