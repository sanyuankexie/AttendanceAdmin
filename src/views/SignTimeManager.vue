<template>
  <div class="container">
    <el-card class="form-card">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="学号" prop="userId">
          <el-input
            v-model.number="form.userId"
            placeholder="请输入操作对象学号"
            clearable
          ></el-input>
        </el-form-item>

        <el-space :size="50" wrap></el-space>

        <el-form-item label="操作类型" prop="operation">
          <el-select v-model="form.operation" placeholder="请选择操作类型">
            <el-option label="增加时间" value="add" />
            <el-option label="减少时间" value="sub" />
            <el-option label="设置时间" value="set" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间（小时）" prop="time">
          <el-input-number
            v-model="form.time"
            :min="0"
          />
        </el-form-item>

        <el-form-item >
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/axios.js'

const formRef = ref(null)
const form = reactive({
  userId: null,
  operation: 'add',
  time: 0
})

const rules = reactive({
  userId: [
    { required: true, message: '请输入用户ID', trigger: 'blur' },
    { type: 'number', message: 'ID必须为数字' }
  ],
  operation: [
    { required: true, message: '请选择操作类型', trigger: 'change' }
  ],
  time: [
    { required: true, message: '请输入时间', trigger: 'blur' }
  ]
})

const submitForm = async () => {
  try {
    await formRef.value.validate()

    const payload = {
      operation: form.operation,
      userId: form.userId,
      time: form.time.toString(),
      token: '520@sanyuankexie'
    }

    const response = await http('/api/user/modify', {
      method: 'POST',
      data: JSON.stringify(payload)
    })

    if (response.data.code === 0) {
      ElMessage.success('操作成功，' + '现在总时长：' + response.data.data.totalTime + "h")
      resetForm()
    } else {
      ElMessage.error(result.message || '操作失败')
    }
  } catch (error) {
    ElMessage.error('请求出错：' + error.message)
  }
}

const resetForm = () => {
  formRef.value.resetFields()
}
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  padding: 25px;
}

</style>
