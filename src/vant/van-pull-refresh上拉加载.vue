<!-- <div class="pull-list">
  <recordPullList
    ref="recordlist"
    :reason="reason"
    :listType="listType"
    :type="type"
    :sort="sort"
    :showTotal.sync="showTotal"
  />
</div>

pull-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
} -->

<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        finished-text=""
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <div v-for="(item, index) in tableList" :key="item.id" class="item" @click="toDetail(item)">
          <div class="header">
            <span>{{ item.type === "leave" ? "请假" : "补卡" }}</span>
            <StepTag v-if="roleType !== 'approval'" :tagValue="item.status" />
            <StepApprovalTag
              v-if="roleType === 'approval' && listType !== 'todo'"
              :tagValue="item.statusZh"
            />
          </div>
          <div class="content">
            <span class="content-label">开始时间</span>
            <span>{{ calcTimeDay(item.startDay) }} {{ item.startTime }}</span>
          </div>
          <div class="content">
            <span class="content-label">结束时间</span>
            <span>{{ calcTimeDay(item.endDay) }} {{ item.endTime }}</span>
          </div>
          <div class="content">
            <span class="content-label">{{ item.type === "leave" ? "请假" : "补卡" }}事由</span>
            <span>{{ item.reason || "--" }}</span>
          </div>
          <div class="content last">
            <span class="content-label">提交人</span>
            <span>{{ item.creater }}</span>
            <span class="time">{{ calcTime(item.createTime) }}</span>
          </div>
          <div class="footer2" v-if="roleType === 'approval' && listType === 'todo'">
            <van-button
              type="default"
              class="agree-btn"
              @click.stop="toApprovalClick(item, 'agree')"
            >
              同意
            </van-button>
            <van-button type="default" @click.stop="toApprovalClick(item, 'refuse')">
              退回
            </van-button>
          </div>
          <div class="footer" v-else-if="showLabel(item.operations, item)">
            <van-button type="default" :loading="btnloading" @click.stop="toClick(item, index)">
              {{ showLabel(item.operations, item) }}
            </van-button>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import {
  getLeaveList,
  withdrawLeave,
  deleteLeave,
  withdrawCorrect,
  deleteCorrect,
  getToNum,
  getTreviewManagementNum,
} from "@/mobile/api/application.js";
import StepTag from "./StepTag.vue";
import StepApprovalTag from "./StepApprovalTag.vue";

export default {
  components: { StepTag, StepApprovalTag },
  props: {
    reason: { type: String, default: "" },
    listType: { type: String, default: "" },
    type: { type: String, default: "" },
    sort: { type: String, default: "" },
    roleType: { type: String, default: "" },
    showTotal: { type: [String, Number], default: 0 },
  },
  data() {
    return {
      refreshing: false,
      loading: false,
      finished: false,
      error: false,
      tableList: [],
      page: {
        pageNo: 0,
        pageSize: 100,
      },
      btnloading: false,
      labelObj: {
        return: "撤回",
        delete: "删除",
        upload: "上传证明",
        agree: "同意",
        back: "退回",
      },
    };
  },
  methods: {
    getToNum() {
      getToNum().then(({ data }) => {
        this.$emit(
          "update:showTotal",
          (data || []).reduce((pre, cur) => pre + cur.count, 0)
        );
      });
    },
    getTreviewManagementNum() {
      getTreviewManagementNum().then(({ data }) => {
        this.$emit("update:showTotal", data || 0);
      });
    },
    onRefresh() {
      this.btnloading = false;
      this.finished = false;
      this.loading = true;
      this.refreshing = true;
      this.page.pageNo = 0;
      this.page.pageSize = 100;
      this.onLoad();
    },
    onLoad() {
      if (this.roleType === "approval") {
        this.getTreviewManagementNum();
      } else {
        this.getToNum();
      }
      if (this.refreshing) {
        this.tableList = [];
        this.refreshing = false;
      }
      this.page.pageNo += 1;
      const postDate = {
        reason: this.reason,
        listType: this.listType,
        type: this.type,
        sort: this.sort,
        role: this.roleType === "approval" ? "OG_MANAGER" : "OG_ENGINEER",
        ...this.page,
      };
      getLeaveList(postDate)
        .then(({ data }) => {
          this.tableList = [...this.tableList, ...(data.rows || [])];
          this.loading = false;
          this.finished = this.tableList.length >= data.total;
        })
        .catch((_) => {
          // this.error = true
          this.loading = false;
        });
    },
    calcTime(time) {
      if (!time) return "--";
      return this.$moment(time).format("YYYY-MM-DD HH:mm");
    },
    calcTimeDay(time) {
      if (!time) return "--";
      return this.$moment(time).format("YYYY-MM-DD");
    },
    showLabel(val, item) {
      if (!val) return false;
      const arr = val.filter((v) => v !== "detail" && v !== "addAgain");
      item.operaUse = arr[0];
      return arr[0] ? this.labelObj[arr[0]] : "";
      // if (status === '0') {
      //   return '撤回'
      // } else if (['1', '2', '3'].includes(status)) {
      //   return '删除'
      // } else if (status === '4') {
      //   return '上传证明'
      // }
    },
    toClick(item, index) {
      const { operaUse, type } = item;
      if (operaUse === "return") {
        this.$dialog
          .confirm({
            message: "是否撤回该条申请",
          })
          .then(() => {
            this.btnloading = true;
            const quest = type === "correct" ? withdrawCorrect : withdrawLeave;
            quest({ processId: item.id })
              .then((_) => {
                this.$toast.success("撤回成功");
                this.tableList.splice(index, 1);
              })
              .finally(() => {
                this.btnloading = false;
              });
          });
      } else if (operaUse === "delete") {
        this.$dialog
          .confirm({
            message: "是否删除该条申请",
          })
          .then(() => {
            this.btnloading = true;
            const quest = type === "correct" ? deleteCorrect : deleteLeave;
            quest({ processId: item.id })
              .then((_) => {
                this.$toast.success("删除成功");
                this.tableList.splice(index, 1);
              })
              .finally(() => {
                this.btnloading = false;
              });
          });
      } else if (operaUse === "upload") {
        this.toDetail(item);
      }
    },
    toApprovalClick(item, val) {
      this.$router.push({
        path: `/${val}`,
        query: {
          id: item.id,
          operateType: item.type,
        },
      });
    },
    toDetail(item) {
      this.$router.push({
        path: `/recordDetail/${item.id}`,
        query: {
          role: this.roleType === "approval" ? "high" : "normal",
          detailType: item.type,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 12px;
  padding: 0 12px;
  overflow: hidden;
  font-size: 14px;
  .header {
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    color: rgb(0, 0, 0);
    font-size: 18px;
  }
  .content {
    display: flex;
    color: rgba(0, 0, 0, 0.9);
    margin-bottom: 8px;
    font-size: 14px;
    &.last {
      margin-bottom: 16px;
    }
    &-label {
      color: rgba(0, 0, 0, 0.5);
      width: 72px;
      flex-shrink: 0;
    }
    .time {
      position: relative;
      top: 4px;
      margin-left: auto;
      color: rgba(0, 0, 0, 0.5);
      font-size: 12px;
    }
  }
  .footer {
    ::v-deep .van-button {
      width: 100%;
      border: 1px solid transparent;
      border-top: 1px solid #ebedf0;
      color: #ff844b;
    }
    ::v-deep .van-button:active::before {
      opacity: 0;
    }
  }
  .footer2 {
    ::v-deep .van-button {
      width: 50%;
      border: 1px solid transparent;
      border-top: 1px solid #ebedf0;
      color: #e6202a;
    }
    .agree-btn {
      border-right: 1px solid #ebedf0;
      color: #0f62fe;
    }
    ::v-deep .van-button:active::before {
      opacity: 0;
    }
  }
}
</style>
