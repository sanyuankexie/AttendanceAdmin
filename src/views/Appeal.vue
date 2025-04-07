<template>
  <div class="appeal-container">
    <!-- 搜索栏 -->
    <el-card class="search-box">
      <el-form :inline="true">
        <el-form-item label="申诉状态">
          <el-select v-model="searchParams.status" clearable>
            <!-- 统一使用字符串类型 -->
            <el-option label="全部" value="啊啊啊啊啊" />
            <el-option label="审核中" value="爱斯基摩那块" />
            <el-option label="审核通过" value="阿萨" />
            <el-option label="审核不通过" value="2" />
            <el-option label="提交失败" value="-1" />
            <el-option label="状态异常" value="-2" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="searchParams.term" placeholder="请输入学期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card>
      <el-table :data="appealList" v-loading="loading">
        <el-table-column prop="appealUser.name" label="申诉人"/>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="statusTagType[row.status]">
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="补加时长">
          <template #default="{ row }">
            {{ row.requireAddTime }} h
          </template>
        </el-table-column>
        <el-table-column prop="appealTime" label="申诉时间">
          <template #default="{ row }">
            {{ formatTime(row.appealTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="dealTime" label="处理时间">
          <template #default="{ row }">
            {{ row.dealTime ? formatTime(row.dealTime) : '未处理' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              @click="showDetail(row)"
              :disabled="row.status === -1"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.size"
        :total="pagination.total"
        @current-change="loadData"
        layout="total, prev, pager, next"
      />
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="申诉详情"
      size="60%"
    >
      <div class="detail-content" v-if="currentAppeal">
        <!-- 基本信息 -->
        <el-descriptions title="基本信息" border>
          <el-descriptions-item label="申诉编号">{{ currentAppeal.id }}</el-descriptions-item>
          <el-descriptions-item label="申诉人">
            {{ currentAppeal.appealUser?.name }}
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            {{ currentAppeal.appealUser?.id }}
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            {{ currentAppeal.appealUser?.dept }}
          </el-descriptions-item>
          <el-descriptions-item label="方向">
            {{ currentAppeal.appealUser?.learn }}
          </el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="statusTagType[currentAppeal.status]">
              {{ statusMap[currentAppeal.status] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="学期">{{ currentAppeal.term }}</el-descriptions-item>
          <el-descriptions-item label="申请补时">{{ currentAppeal.requireAddTime }} 小时</el-descriptions-item>
        </el-descriptions>

        <!-- 申诉内容 -->
        <el-card class="detail-section">
          <template #header>
            <div class="detail-section-title">申诉理由</div>
          </template>
          <div class="reason-content">{{ currentAppeal.reason }}</div>
        </el-card>

        <!-- 证明材料 -->
        <el-card class="detail-section">
          <template #header>
            <div class="detail-section-title">证明材料</div>
          </template>
          <div class="image-list">
            <el-image
              v-for="(url, index) in currentAppeal.appealImageUrls"
              :key="index"
              :src="url"
              :preview-src-list="currentAppeal.appealImageUrls"
              fit="cover"
              class="proof-image"
            />
          </div>
        </el-card>

        <!-- 处理表单 -->
        <el-card class="detail-section" v-if="currentAppeal.status === 0">
          <template #header>
            <div class="detail-section-title">处理申诉</div>
          </template>
          <el-form
            :model="handleForm"
            label-width="120px"
            ref="handleFormRef"
          >
            <el-form-item label="处理结果" required>
              <el-radio-group v-model="handleForm.result">
                <el-radio :label="true">通过</el-radio>
                <el-radio :label="false">不通过</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="实际补时"
              prop="realAddTime"
              v-if="handleForm.result === true"
              :rules="[{ required: true, message: '请输入补时时间' }]"
            >
              <el-input
                v-model="handleForm.realAddTime"
                placeholder="请输入实际批准补加时长"
                suffix="小时"
              />
            </el-form-item>

            <el-form-item
              label="不通过理由"
              prop="failedReason"
              v-if="handleForm.result === false"
              :rules="[{ required: true, message: '请输入不通过理由' }]"
            >
              <el-input
                v-model="handleForm.failedReason"
                type="textarea"
                :rows="3"
                placeholder="请输入不通过的具体原因"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitHandle">提交处理</el-button>
              <el-button @click="detailVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 处理结果 -->
        <el-card class="detail-section" v-if="currentAppeal.status !== 0">
          <template #header>
            <div class="detail-section-title">处理结果</div>
          </template>
          <div v-if="currentAppeal.status === 1">
            <div>实际补加时长：{{ currentAppeal.realAddTime }} 小时</div>
            <div>处理人：{{ currentAppeal.operator?.name }}</div>
            <div>处理时间：{{ formatTime(currentAppeal.dealTime) }}</div>
          </div>
          <div v-else-if="currentAppeal.status === 2">
            <div>不通过理由：{{ currentAppeal.failedReason }}</div>
            <div>处理人：{{ currentAppeal.operator?.name }}</div>
            <div>处理时间：{{ formatTime(currentAppeal.dealTime) }}</div>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import http from '@/utils/axios.js'
import { Utils } from '@/utils/decrypt.js'

// 状态映射
const statusMap = {
  '-2': '状态异常',
  '-1': '提交失败',
  0: '审核中',
  1: '审核通过',
  2: '审核不通过'
}

const statusTagType = {
  '-2': 'danger',
  '-1': 'warning',
  0: 'warning',
  1: 'success',
  2: 'danger'
}

// 数据相关
const loading = ref(false)
const appealList = ref([])
const currentAppeal = ref(null)
const detailVisible = ref(false)

// 分页配置
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

// 搜索参数
const searchParams = reactive({
  status: '',
  term: ''
})

// 处理表单
const handleForm = reactive({
  result: null,
  realAddTime: '',
  failedReason: ''
})

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const res = await http.get('/api/appeal/getAppeal')
    appealList.value = res.data.data
    pagination.total = res.data.data.length
  } catch (error) {
    console.log(error)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 显示详情
const showDetail = (row) => {
  currentAppeal.value = row
  handleForm.realAddTime = row.requireAddTime  // 默认时长为申诉要求的补加时长
  detailVisible.value = true
}

// 提交处理
const submitHandle = async () => {
  try {
    const params = {
      dealAppealId: currentAppeal.value.id,
      realAddTime: handleForm.realAddTime,
      failedReason: handleForm.failedReason,
      operatorId: Utils.decrypt(localStorage.getItem("id"), 'kexieisbest'),
      result: handleForm.result
    }
    const res = await http.post('/api/appeal/dealAppeal', params)
    if (res.data.code === 0) {
      ElMessage.success('处理成功')
      detailVisible.value = false
      await loadData()
    } else {
      ElMessage.error("处理提交失败")
    }
  } catch (error) {
    ElMessage.error('处理提交失败')
  }
}

// 时间格式化
const formatTime = (timestamp) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.appeal-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.detail-content {
  padding: 20px;
}

.detail-section {
  margin-top: 20px;
}

.detail-section-title {
  font-weight: bold;
}

.reason-content {
  line-height: 1.6;
  color: #666;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.proof-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
