<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形组件 -->
      <el-tree default-expand-all="" :data="depts" :props="defaultProps">
        <template v-slot="{data}">
          <!-- 节点结构 -->
          <el-row
            style="width: 100%"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown>
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getDepartment } from "@/api/department"
import { transLisToTreeData } from "@/utils"
export default {
  name: "Department",
  data() {
    return {
      depts: [ ], //数据
      defaultProps: {
        label: "name", //要显示的字段名
        children: "children", //字段
      },
    };
  },
  created(){
    this.getDepartment() //调用methods里获取数据的接口
  },
  methods:{
    async getDepartment(){ //这个只是方法名
      const result = await getDepartment() //这个才是接口名
      this.depts = transLisToTreeData(result,0)
    }
  },
 
};
</script>
<style scoped>
.tree-manager{
  width: 50px;
  display: inline-block;
  margin-right: 55px;
}
</style>