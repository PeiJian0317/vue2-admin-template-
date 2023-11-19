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
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table>
          <el-table-column label="头像" align="center" />
          <el-table-column label="姓名" />
          <el-table-column label="手机号" sortable />
          <el-table-column label="工号" sortable />
          <el-table-column label="聘用形式" />
          <el-table-column label="部门" />
          <el-table-column label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template>
              <el-button size="mini" type="text">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination 
          layout="total,prev, pager, next" 
          :total="1000" 
          />
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartment } from "@/api/department";
import { transLisToTreeData } from "@/utils";
export default {
  name: "Employee",
  data() {
    return {
      depts: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      queryParams: {
        departmentId: null,
      },
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
        //此时表示树组件渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id;
    },
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
