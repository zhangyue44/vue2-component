<el-form-item
  label="关联教室"
  class="room-item"
  prop="classroomList"
  content-width="1000px">
  <el-table :data="form.classroomList" highlight-current-row>
    <el-table-column label="教室讲师" prop="teacherPersonId">
      <template slot-scope="scope">
        <el-form-item :prop="'classroomList.' + scope.$index + '.teacherPersonId'" :rules="rules.teacherPersonId" content-width="100%">
          <el-select v-model="scope.row.teacherPersonId" placeholder="请选择">
            <el-option
              v-for="t in teacherList"
              :key="t.id"
              :label="t.personName"
              :value="t.id"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column label="讲师类型" prop="mainType">
      <template slot-scope="scope">
        <el-form-item :prop="'classroomList.' + scope.$index + '.mainType'" :rules="rules.mainType" content-width="100%">
          <el-select v-model="scope.row.mainType" placeholder="请选择">
            <el-option
              v-for="t in mainTypes"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column label="授课类型">
      <template>线下</template>
    </el-table-column>
    <el-table-column label="教室名称" prop="classroomId">
      <template slot-scope="scope">
        <el-form-item
          :ref="`classroomid${scope.$index}`"
          :prop="'classroomList.' + scope.$index + '.classroomId'"
          :rules="rules.classroomId"
          content-width="100%">
          <template v-if="scope.row.classroomId">
            {{ scope.row.classroomName }}
            <el-button type="link" @click="appointRoom(scope.row,scope.$index)">重新预约</el-button>
          </template>
          <template v-else>
            <el-button @click="appointRoom(scope.row, scope.$index)"><i class="h-icon-add"></i>预约</el-button>
          </template>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column label="可容纳人数" prop="personNum">
      <template slot-scope="{row}">
        {{ row.personNum || 0 }}人
      </template>
    </el-table-column>
    <el-table-column label="学员权限" prop="personNum">
      <template slot-scope="{row}">
        {{ (row.classroomStudents?`${row.classroomStudents.length}名学员`:'0名学员') }}
        <el-button type="link" @click="handleSelectStudent(row)">选择</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{row,$index}">
        <el-button type="link" @click="removeRoom($index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-form-item>

rules: {
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { validator: checkName, trigger: 'blur' },
  ],
  classId: [{ required: true, message: '请选择课程分类', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择上课时间', trigger: 'blur' }],
  coverUploadId: [{ required: true, message: '请选择课程封面', trigger: 'blur' }],
  classroomList: [
    { type: 'array', required: true, message: '请选择关联教室', trigger: 'blur' },
    { validator:validator1, trigger: 'blur' },
  ],
  teacherPersonId: [{ required: true, message: '请选择教室讲师', trigger: 'change' }],
  mainType: [{ type:'number', required: true, message: '请选择讲师类型', trigger: 'change' }],
  // joinType: [{ type:'number', required: true, message: '请选择授课类型', trigger: 'change' }],
  classroomId: [{ required: true, message: '请选择教室', trigger: 'blur' }],
},
