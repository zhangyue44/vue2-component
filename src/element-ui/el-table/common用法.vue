<template>
  <div class="flex-1 flex flex-col p-4 pb-0 w-full overflow-hidden">
    <div class="flex-1 overflow-hidden">
      <el-table :data="tableList" height="100%" highlight-current-row>
        <el-table-column label="编号" prop="positionCode" />
        <el-table-column label="点位名称">
          <template slot-scope="{ row }">
            <span style="color: #176cff" class="cursor-pointer" @click="handlerDetail(row)">{{
              row.positionName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusDesc" width="120" />
        <el-table-column label="所属目录" prop="groupName" />
        <el-table-column label="所属区域 " prop="regionName" />
        <el-table-column label="模板" prop="templateName" />
        <el-table-column label="勘点人" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.surveyNameList.join(",") || "--" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近勘点时间" prop="surveyTime" />
      </el-table>
    </div>
    <div style="flex-shrink: 0">
      <el-pagination
        :current-page="pageParams.pageNum"
        :page-sizes="[20, 50, 100]"
        :page-size="pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
