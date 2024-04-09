<template>
  <div class="px-4 overflow-auto">
    <div class="h-[720px] bg-black flex justify-center">
      <video
        v-if="ACCEPTFILEMAP.video.includes(showInfo.coursewareType)"
        ref="video"
        :src="joinImgSrc(detailData.fileUrl)"
        class="h-full"
        :class="{ videoids: !info.allowDrag && showInfo.maxProgress < 100 }"
        preload="auto"
        controls
        @loadeddata="loadeddata"
        @play="play"
        @pause="pause"
        @timeupdate="timeupdate"
        @ended="ended"
      />
      <img
        v-else-if="ACCEPTFILEMAP.image.includes(showInfo.coursewareType)"
        :src="joinImgSrc(detailData.fileUrl)"
        alt="图片加载失败"
        class="w-full h-full"
      />
      <PDFPreviewProgress
        v-else-if="
          ACCEPTFILEMAP.ppt.includes(showInfo.coursewareType) ||
          ACCEPTFILEMAP.word.includes(showInfo.coursewareType) ||
          ACCEPTFILEMAP.pdf.includes(showInfo.coursewareType)
        "
        ref="pdf"
        :path="joinImgSrc(detailData.fileUrl)"
        :info="showInfo"
        @updatePdfProgress="updatePdfProgress"
      />
      <downloadType v-else-if="detailData.materialId" :info="detailData"></downloadType>
      <div
        v-if="!showInfo.id"
        class="w-full h-full flex flex-col items-center justify-center gap-y-4 text-gray-400 text-4xl"
      >
        请选择章节进行学习
      </div>
    </div>
    <div
      v-if="
        showInfo.questions &&
        showInfo.questions.length &&
        (ACCEPTFILEMAP.ppt.includes(showInfo.coursewareType) ||
          ACCEPTFILEMAP.word.includes(showInfo.coursewareType) ||
          ACCEPTFILEMAP.pdf.includes(showInfo.coursewareType))
      "
      class="flex items-center bg-white p-2 mt-4"
    >
      <span>随堂测验</span>
      <span class="ml-auto mr-4">共{{ showInfo.questions.length }}道题</span>
      <el-button type="primary" @click="toExam">开始答题</el-button>
    </div>
    <examAuto :visible.sync="examVisible" :info="videoExam" @confirm="confirm"></examAuto>
    <exams :visible.sync="examAllVisible" :info-list="infoList"></exams>
  </div>
</template>

<script>
import { ACCEPTFILEMAP } from "@/constant.js";
import { updateLearnProgress } from "@/api/course/progress.js";
import { getMaterialDetailApi } from "@/api/courseware/index.js";
import { getQuestionDetail } from "@/api/exam/question.js";
import EventBus from "@/pages/student-workbench/recordDetail/eventBus.js";
import downloadType from "./components/downloadType.vue";
import PDFPreviewProgress from "./PDFPreviewProgress.vue";
import examAuto from "./components/examAuto.vue";
import exams from "./components/exams.vue";

export default {
  components: { downloadType, PDFPreviewProgress, examAuto, exams },
  props: {
    learnRecordId: { type: String, default: "" },
    info: { type: Object, default: () => ({}) },
    processInfo: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      ACCEPTFILEMAP, // 所有类型
      showInfo: {}, // 选择的小节
      detailData: {},
      videoExam: {},
      infoList: [],
      timeArray: [],
      progressObj: {
        duration: 0,
        play: false,
        timer: null,
      },
      examVisible: false,
      examAllVisible: false,
    };
  },
  destroyed() {
    EventBus.$off("preview", this.preview);
  },
  created() {
    EventBus.$on("preview", this.preview);
  },
  methods: {
    async preview(it) {
      this.progressObj.duration = 0;
      this.progressObj.play = false;
      if (this.progressObj.timer) {
        clearTimeout(this.progressObj.timer);
        this.progressObj.timer = null;
      }
      this.showInfo = it;
      this.videoExam = {};
      this.infoList = [];
      const { data } = await getMaterialDetailApi({ materialId: it.coursewareId });
      this.detailData = data || {};
      if (this.ACCEPTFILEMAP.video.includes(this.showInfo.coursewareType)) {
        this.timeArray = this.showInfo.questions.map((v) => v.showPoint);
      }
    },
    loadeddata() {
      this.progressObj.duration = this.$refs.video.duration;
      this.$refs.video.currentTime = this.showInfo.currentProgress;
    },
    play() {
      this.progressObj.play = true;
      if (this.progressObj.timer) return;
      this.getStart();
    },
    pause() {
      this.progressObj.play = false;
    },
    ended() {
      if (this.progressObj.timer) {
        clearTimeout(this.progressObj.timer);
        this.progressObj.timer = null;
      }
      this.updateLearnProgress();
    },
    getStart() {
      const that = this;
      this.progressObj.timer = setTimeout(() => {
        clearTimeout(that.progressObj.timer);
        that.progressObj.timer = null;
        that.updateLearnProgress();
      }, 5000);
    },
    updateLearnProgress() {
      if (!this.$refs.video) return;
      const currentProgress = Math.floor(this.$refs.video.currentTime);
      updateLearnProgress({
        currentProgress,
        learnRecordId: this.learnRecordId,
        subsectionId: this.showInfo.id,
      }).then(({ data }) => {
        this.processInfo.progressPercent = data.progressPercent || 0;
        if (this.$refs.video) {
          this.showInfo.currentProgress = currentProgress;
          this.showInfo.progressPercent = currentProgress / Math.floor(this.progressObj.duration);
          if (this.showInfo.progressPercent == 1) this.showInfo.maxProgress = 100;
        }
      });
      if (this.progressObj.play) this.getStart();
    },
    updatePdfProgress(pageNum, pagesCount) {
      if (!this.$refs.pdf) return;
      updateLearnProgress({
        currentProgress: pageNum,
        learnRecordId: this.learnRecordId,
        subsectionId: this.showInfo.id,
      }).then(({ data }) => {
        this.processInfo.progressPercent = data.progressPercent || 0;
        if (this.$refs.pdf) {
          this.showInfo.currentProgress = pageNum;
          this.showInfo.progressPercent = pageNum / pagesCount;
        }
      });
    },
    timeupdate() {
      if (!this.timeArray.length) return;
      const time = Math.floor(this.$refs.video.currentTime);
      if (this.timeArray.includes(time)) {
        this.$refs.video.pause();
        this.timeArray.shift();
        const info = this.showInfo.questions.find((v) => v.showPoint === time);
        this.getQuestionDetail(info.questionId, info.allowSkip);
      }
    },
    async getQuestionDetail(id, allowSkip) {
      const { data } = await getQuestionDetail({ id });
      this.videoExam = { ...(data || {}), allowSkip };
      this.$nextTick(() => {
        this.examVisible = true;
      });
    },
    confirm() {
      this.$refs.video && this.$refs.video.play();
    },
    async toExam() {
      const res = await Promise.all(
        this.showInfo.questions.map((v) => getQuestionDetail({ id: v.questionId }))
      );
      this.infoList = res.map((v) => ({ ...v.data }));
      this.$nextTick(() => {
        this.examAllVisible = true;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.videoids::-webkit-media-controls-timeline {
  display: none;
}
</style>
