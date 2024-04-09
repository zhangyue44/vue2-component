<template>
  <el-upload
    ref="specialUpload"
    class="upload-demo w-full mt-4"
    :action="VUE_APP_API_BASE_URL + '/esurvey/ui/import/position/import'"
    :show-file-list="false"
    :headers="{ 'X-Requested-With': 'XMLHttpRequest', Authorization: token }"
    :data="uploadData"
    accept=".kml,.ovkml,.xlsx,.xlsm"
    :before-upload="beforeUploadKml"
    :on-success="handleUploadKmlSuccess"
    :on-error="
      () => {
        $message.error('导入失败');
      }
    "
  >
    <el-button type="default" class="w-full" :loading="loading"> 导入 </el-button>
  </el-upload>
</template>

<script>
export default {
  methods: {
    // 处理完逻辑后，需再次提交上传的做法：1.更改文件的状态，改为准备状态；2.手动调用submit进行上传
    useTemplate(val) {
      this.$refs.specialUpload.uploadFiles.forEach((v) => {
        v.status = "ready";
      });
      this.$nextTick(() => {
        this.$refs.specialUpload.submit();
      });
    },
  },
};
</script>
