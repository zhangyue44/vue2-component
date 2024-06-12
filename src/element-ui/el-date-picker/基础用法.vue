<el-date-picker
  v-if="timePattern === 'cutsom'"
  v-model="selectTime"
  ref="datepicker"
  type="daterange"
  :clearable="false"
  style="width: 240px; margin-left: 8px"
  start-placeholder="开始日期"
  end-placeholder="结束日期"
/>
