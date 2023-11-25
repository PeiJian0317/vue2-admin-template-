<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
          v-model="queryParams.keyword"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          @current-change="selectNode"
        >
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')" v-permission="'add-employee'">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" label="头像" align="center">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :size="30" :src="row.staffPhoto"/>
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if ="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" size="mini" type="text" style="margin-left:10px">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination 
          layout="total,prev, pager, next" 
          :total='total'
          :current-page='queryParams.page'
          :page-size='queryParams.pagesize'
          @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- 放置导入excel组件 -->
    <import-excel :showExcelDialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList"/>
    <!-- 点击分配角色弹层 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- 弹层内容 -->
      <el-checkbox-group v-model="roleIDs">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from "@/api/department";
import { transLisToTreeData } from "@/utils";
import { getEmployeeList,exportEmployee,delEmployee,getEnableRoleList,getEmployeeDetail,assignRole } from '@/api/employee'
import FileSaver from 'file-saver'
import importExcel from './components/import-excel'
export default {
  name: "Employee",
  components:{
    importExcel
  },
  data() {
    return {
      depts: [], //树形组件
      defaultProps: {
        children: "children",
        label: "name",
      },
      queryParams: {
        page:1, //当前页码
        pagesize:10,
        departmentId: null,
        keyword: '' // 模糊搜索字段
      },
      list:[], //存储员工列表数据
      total:0, //记录当前查询员工的总数
      showExcelDialog: false, //控制excel弹层是否显示
      showRoleDialog:false, //控制角色弹层是否显示
      roleList:[], //接收角色列表
      roleIDs:[], //把多个 checkbox 管理为一组
      currentuserID:null, //记录当前点击角色的id
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    async getDepartment() {
      this.depts = transLisToTreeData(await getDepartment(), 0);
      //初始化获取首个节点 -->传智教育 (记录下该节点)
      this.queryParams.departmentId = this.depts[0].id;
      //设置选中节点
      //树组件渲染是异步的
      this.$nextTick(() => {
        //此时表示树组件渲染完毕,设置默认(传智教育)高亮
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });
      this.getEmployeeList()
    },
    //当节点更换时触发的方法(更换部门)
    selectNode(node) {
      this.queryParams.departmentId = node.id;
      this.getEmployeeList()
      this.queryParams.page = 1
    },
    //获取员工列表
    async getEmployeeList(){
      const { rows,total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    //更换页码时
    changePage(newPage){
      this.queryParams.page = newPage //赋值新页码
      this.getEmployeeList() //查询数据
    },
    //当input里的值发生修改时
    changeValue(){
      //利用定时器来节流和防抖
      clearTimeout(this.timer) //清除定时器
      //this的实例上赋值了一个timer属性
      this.timer = setTimeout(() =>{
        this.queryParams.page = 1
        this.getEmployeeList()
      },500)
      //定时器500ms后会销毁,如果500ms内重新输入了就清楚定时器
      //否则就等500ms后再执行定时器里的逻辑
    },
    //导入员工excel
    async exportEmployee(){
     const result = await exportEmployee() //导出所有员工
     //console.log(result)  //使用一个npm包,将blob文件下载到本地
     FileSaver.saveAs(result,"员工信息表.xlsx") //下载文件
    },
    //消息气泡框的确定删除
    async confirmDel(id){
      //调用删除接口
      await delEmployee(id)
      //当数据只剩一个
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      //重新加载数据
      this.getEmployeeList()
      this.$message.success("删除员工成功")
    },
    //点击角色按钮弹出层
    async btnRole(id){
     this.roleList = await getEnableRoleList()
     //记录下当前点击角色按钮的用户id --> 为了之后做确认和取消用
      this.currentuserID = id
      const { roleIds } = await getEmployeeDetail(id)
      this.roleIDs = roleIds
      this.showRoleDialog = true
    },
    //点击角色弹层里的确定
    async btnRoleOK(){
      await assignRole({id:this.currentuserID,roleIds:this.roleIDs})
      this.$message.success('分配用户成功')
      this.showRoleDialog = false
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
