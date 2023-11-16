<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形组件 -->
      <el-tree default-expand-all="" :expand-on-click-node="false" :data="depts" :props="defaultProps">
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
              <el-dropdown @command="handleCommand($event,data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层 -->
    <!-- .sync表示会接收子组件的事件 -->
    <add-dept :currentID="currentID" :showDialog.sync="showDialog" />
  </div>
</template>
<script>
import { getDepartment } from "@/api/department"
import { transLisToTreeData } from "@/utils"
import addDeptVue from './components/add-dept.vue';
import addDept from './components/add-dept.vue';
export default {
  components: { addDept },
  name: "Department",
  data() {
    return {
      currentID: null, //当前的id
      showDialog: false, //控制弹层显示和隐藏
      depts: [ ], //数据
      defaultProps: {
        label: "name", //要显示的字段名
        children: "children", //字段
      },
      components: {
        addDeptVue
}

    };
  },
  created(){
    this.getDepartment() //调用methods里获取数据的接口
  },
  methods:{
    async getDepartment(){ //这个只是方法名
      const result = await getDepartment() //这个才是接口名
      this.depts = transLisToTreeData(result,0)
    },
    handleCommand(command,id){
      if(command === "add"){
        //添加子部门,调用封装的弹层组件
        this.showDialog = true //显示弹层组件
      }
      this.currentID = id
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