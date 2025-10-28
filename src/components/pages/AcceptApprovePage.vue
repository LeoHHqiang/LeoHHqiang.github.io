<template>
  <main class="main-content">
    <div class="content-body partitioned">
      <div class="left-area">
        <h2>验收审批</h2>
        <p>这里是左侧主内容区</p>
      </div>
      <div class="right-area">
        <div class="right-upper">
          <!-- CalendarWidget -->
          <div class="calendar-widget">
            <div class="calendar-header">
              <span class="arrow year-arrow" title="上一年" @click="prevYear">&laquo;</span>
              <span class="arrow month-arrow" title="上一月" @click="prevMonth">&lsaquo;</span>
              <span class="month-text">{{ displayDateText }}</span>
              <span class="arrow month-arrow" title="下一月" @click="nextMonth">&rsaquo;</span>
              <span class="arrow year-arrow" title="下一年" @click="nextYear">&raquo;</span>
            </div>
            <div class="calendar-week">
              <div class="week-day">日</div>
              <div class="week-day">一</div>
              <div class="week-day">二</div>
              <div class="week-day">三</div>
              <div class="week-day">四</div>
              <div class="week-day">五</div>
              <div class="week-day">六</div>
            </div>
            <div class="calendar-dates">
              <!-- 上月剩余日期占位 -->
              <div 
                v-for="i in firstDayOfWeek" 
                :key="`empty-${i}`"
                class="calendar-date other-month"
              ></div>
              
              <!-- 当月日期 -->
              <div 
                v-for="day in daysInMonth" 
                :key="day"
                class="calendar-date"
                :class="{
                  'today': isToday(day),
                  'selected': isSelected(day)
                }"
                @click="selectDate(day)"
              >
                <span class="day">{{ day }}</span>
                
                <!-- 日程点 -->
                <div class="schedule-dots">
                  <span 
                    v-for="(color, index) in getScheduleDots(day)"
                    :key="index"
                    class="dot"
                    :style="{ backgroundColor: color }"
                  ></span>
                </div>
              </div>
              
              <!-- 下月剩余日期占位 -->
              <div 
                v-for="i in remainingDays" 
                :key="`empty-next-${i}`"
                class="calendar-date other-month"
              ></div>
            </div>
            
            <!-- 今天按钮 -->
            <div class="today-button-container">
              <button class="today-button" @click="goToToday">
                今天
              </button>
            </div>
          </div>
        </div>
        <div class="right-lower">
          <h3>右下区域</h3>
          <p>这里是右边下半部分的内容</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
/* eslint-disable */
import { ref, computed, defineExpose } from 'vue'

defineProps({
  pageName: {
    type: String,
    default: '验收审批'
  }
})

// 模拟日程数据
const scheduleData = ref({
  2025: {
    11: {
      4: ['green', 'purple'],
      5: ['pink', 'blue', 'orange', 'red'],
      10: ['green', 'purple', 'orange'],
      15: ['purple'],
      20: ['green', 'blue', 'orange'],
      25: ['purple', 'blue', 'orange'],
      30: ['green', 'pink', 'orange']
    },
    10: {
      11: ['red', 'blue']
    }
  }
})

// 当前显示的年月 + 当天日期信息
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(null)

const today = new Date()
const todayYear = today.getFullYear()
const todayMonth = today.getMonth()
const todayDay = today.getDate()

// 计算属性
const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const remainingDays = computed(() => {
  const totalRenderedDays = firstDayOfWeek.value + daysInMonth.value
  const weeks = Math.ceil(totalRenderedDays / 7)
  return weeks * 7 - totalRenderedDays
})

// 头部显示文本：优先显示选中日期，否则显示当月的“今天日”，若不在本月则显示 1 日
const displayDateText = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value + 1
  let day = 1
  if (selectedDate.value && selectedDate.value.year === year && selectedDate.value.month === currentMonth.value) {
    day = selectedDate.value.day
  } else if (todayYear === year && todayMonth === currentMonth.value) {
    day = todayDay
  }
  return `${year} 年 ${month} 月 ${day} 日`
})

// 方法
const isToday = (day) => {
  return currentYear.value === todayYear && 
         currentMonth.value === todayMonth && 
         day === todayDay
}

const isSelected = (day) => {
  return selectedDate.value && 
         selectedDate.value.year === currentYear.value && 
         selectedDate.value.month === currentMonth.value && 
         selectedDate.value.day === day
}

const selectDate = (day) => {
  if (!isToday(day)) {
    selectedDate.value = { 
      year: currentYear.value, 
      month: currentMonth.value, 
      day 
    }
  }
}

const getScheduleDots = (day) => {
  return scheduleData.value[currentYear.value]?.[currentMonth.value + 1]?.[day] || []
}

// 年月切换方法
const prevMonth = () => {
  currentMonth.value--
  if (currentMonth.value < 0) {
    currentMonth.value = 11
    currentYear.value--
  }
  selectedDate.value = null
}

const nextMonth = () => {
  currentMonth.value++
  if (currentMonth.value > 11) {
    currentMonth.value = 0
    currentYear.value++
  }
  selectedDate.value = null
}

const prevYear = () => {
  currentYear.value--
  selectedDate.value = null
}

const nextYear = () => {
  currentYear.value++
  selectedDate.value = null
}

// 快速回到今天
const goToToday = () => {
  currentYear.value = todayYear
  currentMonth.value = todayMonth
  selectedDate.value = null
}

// 预留的事件标记方法
const addEventToDate = (year, month, day, eventColor) => {
  if (!scheduleData.value[year]) {
    scheduleData.value[year] = {}
  }
  if (!scheduleData.value[year][month]) {
    scheduleData.value[year][month] = {}
  }
  if (!scheduleData.value[year][month][day]) {
    scheduleData.value[year][month][day] = []
  }
  scheduleData.value[year][month][day].push(eventColor)
}

const removeEventFromDate = (year, month, day, eventColor) => {
  if (scheduleData.value[year]?.[month]?.[day]) {
    const index = scheduleData.value[year][month][day].indexOf(eventColor)
    if (index > -1) {
      scheduleData.value[year][month][day].splice(index, 1)
    }
  }
}

const getEventsForDate = (year, month, day) => {
  return scheduleData.value[year]?.[month]?.[day] || []
}

// 暴露方法供父组件使用
defineExpose({
  addEventToDate,
  removeEventFromDate,
  getEventsForDate,
  scheduleData
})
</script>

<style scoped>
.main-content {
  flex: 1;
  background-color: #f5f5f5;
  overflow-y: auto;
  padding: 10px;
  height: calc(100vh - 71px);
}

.content-body {
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: block;
  height: 100%;
}

.content-body.partitioned {
  display: flex;
  gap: 10px;
}

.left-area {
  flex: 1;
  min-width: 0;
}

.right-area {
  width: 360px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-upper {
  flex: 1;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

.right-lower {
  height: 220px;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 6px;
}

/* Calendar styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Microsoft Yahei", sans-serif;
}

.calendar-widget {
  width: 100%;
  max-width: 340px;
  background: #ffffff;
  border: 1px solid #eef0f3;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background-color: #f6f8fb;
  color: #334155;
}

.calendar-header .arrow {
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

.calendar-header .arrow:hover {
  background: #e8eef8;
  color: #2563eb;
}

.calendar-header .year-arrow {
  font-size: 16px;
}

.calendar-header .month-text {
  font-size: 16px;
  font-weight: 600;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #eef3fb;
  margin: 8px 10px;
  border-radius: 10px;
  overflow: hidden;
}

.calendar-week .week-day {
  text-align: center;
  padding: 8px 0;
  font-size: 12px;
  color: #475569;
}

.calendar-dates {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 6px 8px 4px 8px; /* 缩小底部内边距以减少与按钮的间距 */
}

.calendar-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 0;
  cursor: pointer;
  height: 52px;
}

.calendar-date .day {
  font-size: 14px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: background-color .15s ease, color .15s ease;
}

.calendar-date:hover .day {
  background: #f1f5ff;
}

.calendar-date .schedule-dots {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  margin-top: 4px;
  width: 32px;
}

.calendar-date .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* 今天：浅蓝底、蓝色文字 */
.calendar-date.today .day {
  background: #e7f0ff;
  color: #2563eb;
}

/* 选中：更明显的浅蓝底 */
.calendar-date.selected .day {
  background: #dbeafe;
  color: #1d4ed8;
}

.calendar-date.other-month {
  color: #cbd5e1;
}

.today-button-container {
  padding: 6px 12px; /* 减少上下内边距以贴近日历 */
  background-color: #f6f8fb;
  border-top: 1px solid #eef0f3;
  text-align: center;
}

.today-button {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.today-button:hover {
  background-color: #1e3fa9;
}

.today-button:active {
  background-color: #173686;
}
</style>


