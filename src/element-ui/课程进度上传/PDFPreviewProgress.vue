<template>
  <div class="w-full h-full">
    <iframe id="prf-pre-pro" :src="pdfurl" width="100%" height="100%" />
  </div>
</template>

<script>
import { debounce } from "lodash";

export default {
  props: {
    path: { type: String, default: "" },
    info: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      pdfurl: "",
      interval: null,
    };
  },
  watch: {
    path() {
      this.queryFile();
      this.interval = setInterval(this.checkPdf, 300);
    },
  },
  beforeDestroy() {
    if (this.PDFViewerApplication) {
      this.PDFViewerApplication.pdfViewer.eventBus.off("pagechanging", that.pageChange);
      this.PDFViewerApplication = null;
    }
  },
  methods: {
    queryFile() {
      const fileUrl = "/ontrain-web/pdfjs/web/viewer.html";
      this.pdfurl = `${fileUrl}?file=${encodeURIComponent(this.path)}`;
    },
    checkPdf() {
      if (!document.getElementById("prf-pre-pro")?.contentWindow?.PDFViewerApplication) return;
      const { PDFViewerApplication } = document.getElementById("prf-pre-pro").contentWindow;
      if (!(PDFViewerApplication.pagesCount && PDFViewerApplication.pdfViewer)) return;
      clearInterval(this.interval);
      this.interval = null;
      this.PDFViewerApplication = PDFViewerApplication;
      PDFViewerApplication.page = Math.max(1, this.info.currentProgress);
      const that = this;
      this.PDFViewerApplication.pdfViewer.eventBus.on("pagechanging", that.pageChange);
    },
    pageChange(evt) {
      this.isUPdataProgress(evt.pageNumber, this.PDFViewerApplication.pagesCount);
    },
    isUPdataProgress: debounce(function (pageNum, pagesCount) {
      this.$emit("updatePdfProgress", pageNum, pagesCount);
    }, 1000),
  },
};
</script>
