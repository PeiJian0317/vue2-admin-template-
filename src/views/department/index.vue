<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形组件 -->
      <el-tree default-expand-all=""  :expand-on-click-node="false" :data="depts" :props="defaultProps">
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
    <add-dept ref="addDept" @updateDepartment="getDepartment" :currentID="currentID" :showDialog.sync="showDialog" />
  </div>
</template>
<script>
import { getDepartment,deleteDepartment } from "@/api/department"
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
        this.currentID = id
      }else if(command === "edit"){
        //编辑部门场景
        this.showDialog = true
        this.currentID = id //记录id 要用它获取数据
        //要在子组件获取数据,父组件调用子组件的方法来获取数据 ->利用ref
        //当ref写在组件标签上时,ref此时获取到的是组件的实例对象vc
        this.$nextTick(() =>{
          this.$refs.addDept.getDepartmentDetail()
        })
      }else if(command === 'del'){
        //删除部门
        this.$confirm('您确认要删除该部门吗').then(async () =>{
          await deleteDepartment(id)
          //提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
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