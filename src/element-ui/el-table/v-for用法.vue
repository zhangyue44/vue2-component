<template>
  <div class="w-full h-full overflow-hidden bg-white p-4">
    <el-table :data="tableData" height="100%">
      <el-table-column
        v-for="columnItem in tableColumns"
        :key="columnItem.prop"
        :label="columnItem.label"
        :prop="columnItem.prop"
        :min-width="columnItem.width"
        show-overflow-title
      >
        <template slot-scope="{ row }">
          <span v-if="columnItem.prop === 'joinType'">
            {{ row["joinType"] === 2 ? "线下" : "线上" }}
          </span>
          <span v-else-if="columnItem.prop === 'appointStatus'">
            {{ row["appointStatus"] === 1 ? "成功预约" : "取消预约" }}
          </span>
          <span v-else>{{ row[columnItem.prop] | BLANK_FMT }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryCourseClassroomList } from "@/api/course/classroom.js";

export default {
  props: {
    courseId: { type: String, default: "" },
  },
  data() {
    return {
      tableColumns: [
        { label: "教室名称", prop: "classroomName" },
        { label: "教室类型", prop: "joinType" },
        { label: "讲师", prop: "teacherName" },
        { label: "已分配学员", prop: "studentNum" },
        { label: "预约状态", prop: "appointStatus" },
      ],
      tableData: [],
    };
  },
  created() {
    this.queryCourseClassroomList();
  },
  methods: {
    queryCourseClassroomList() {
      queryCourseClassroomList({
        courseId: this.courseId,
        appointStatus: 1,
      })
        .then(({ data }) => {
          this.tableData = data.list || [];
        })
        .catch((err) => {
          this.tableData = [];
        });
    },
  },
};
</script>
