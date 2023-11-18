<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200px" label="角色" />
        <el-table-column prop="state" align="center" width="200px" label="启用" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.state === 1 ? '已启用' : scope.row.state === 0 ? '未启用' : '无' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column  align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template>
            <el-button size="mini" type="text">分配权限</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="end" style="height:60px;" align="middle">
          <!-- 放置分页组件 -->
          <el-pagination
            layout="prev, pager, next"
            :page-size="pageParams.pagesize"
            :current-page="pageParams.page"
            :total="pageParams.total"
            @current-change="changePage"
            >
          </el-pagination>
        </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog :visible.sync="showDialog" title="新增角色" width="500px">
      <!-- 表单内容 -->
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input style="width: 300px;" size="mini"/>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch size="mini"/>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" style="width: 300px;" size="mini"/>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini">确定</el-button>
              <el-button size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role';
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      //将分页信息放置到一个对象中
      pageParams:{
        page:1, //当前是第几页
        pagesize:5, //每页有多少条数据
        total:0
      },
      showDialog:false
    };
  },
  created(){
    this.getRoleList()
  },
  methods:{
    //获取角色列表
     async getRoleList(){
      const {rows,total} = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
    },
    //切换分页时请求新的数据
    changePage(newPage){
      this.pageParams.page = newPage //赋值当前页码
      this.getRoleList()
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
