<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200px" label="角色" />
        <el-table-column prop="state" align="center" width="200px" label="启用" />
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column  align="center" label="操作" />
      </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="end" style="height:60px;" align="middle">
          <!-- 放置分页组件 -->
          <el-pagination
            layout="prev, pager, next"
            :total="50">
          </el-pagination>
        </el-row>
    </div>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role';
export default {
  name: 'Role',
  data() {
    return {
      list: [],
    };
  },
  created(){
    this.getRoleList()
  },
  methods:{
     async getRoleList(){
      const {rows} = await getRoleList()
      this.list = rows
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
