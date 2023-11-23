<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true"
          >添加角色</el-button
        >
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200px" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              v-if="row.isEdit"
              size="mini"
              v-model="row.editRow.name"
            />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <template slot-scope="scope">
            <!-- 开为1,关为0 -->
            <el-switch
              v-if="scope.row.isEdit"
              v-model="scope.row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span v-else style="margin-left: 10px">{{
              scope.row.state === 1
                ? "已启用"
                : scope.row.state === 0
                ? "未启用"
                : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              type="textarea"
              v-if="row.isEdit"
              size="mini"
              v-model="row.editRow.description"
            />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 编辑状态下 -->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-button type="primary" size="mini" @click="btnEditOK(row)"
                >确定</el-button
              >
              <el-button size="mini" @click="row.isEdit = false"
                >取消</el-button
              >
            </template>
            <template v-else>
              <!-- 放置操作按钮 ---非编辑状态下 -->
              <el-button size="mini" type="text" @click="btnPermission"
                >分配权限</el-button
              >
              <el-button @click="btnEditRow(row)" size="mini" type="text"
                >编辑</el-button
              >
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button
                  style="margin-left: 10px"
                  size="mini"
                  type="text"
                  slot="reference"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="end" style="height: 60px" align="middle">
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
    <el-dialog
      @close="btnCancel"
      :visible.sync="showDialog"
      title="新增角色"
      width="500px"
    >
      <!-- 表单内容 -->
      <el-form
        ref="roleForm"
        label-width="120px"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input style="width: 300px" size="mini" v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch
            size="mini"
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            type="textarea"
            style="width: 300px"
            size="mini"
            v-model="roleForm.description"
          />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK"
                >确定</el-button
              >
              <el-button size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog
      title="提示"
      :visible.sync="showPermissionDialog"
      width="30%"
    >
      <el-tree
        :data="permissionData"
        show-checkbox
        :props="{ label : 'name' ,children : 'children'}"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRoleList, updateRole, delRole } from "@/api/role";
import { getPermissionList } from "@/api/permission";
import { transLisToTreeData } from "@/utils";
export default {
  name: "Role",
  data() {
    return {
      list: [],
      //将分页信息放置到一个对象中
      pageParams: {
        page: 1, //当前是第几页
        pagesize: 5, //每页有多少条数据
        total: 0,
      },
      showDialog: false,
      roleForm: {
        name: "",
        description: "",
        state: 0, // 默认未1启用 关闭 0 打开1
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
      showPermissionDialog:false, //控制权限弹层是否显示
      permissionData:[] //人员权限数据
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams);
      this.list = rows;
      this.pageParams.total = total;
      //针对每一行数据添加一个编辑标记
      this.list.forEach((item) => {
        // item.isEdit = false
        this.$set(item, "isEdit", false); //新增数据必须是响应式的 ->响应式就要用$set
        this.$set(item, "editRow", {
          //对数据进行缓存
          name: item.name,
          state: item.state,
          description: item.description,
        });
      });
    },
    //切换分页时请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage; //赋值当前页码
      this.getRoleList();
    },
    //点击确定
    async btnOK() {
      await addRoleList(this.roleForm);
      this.$message.success("新增角色成功");
      this.getRoleList();
      this.btnCancel();
    },
    //点击取消
    btnCancel() {
      this.$refs.roleForm.resetFields(); //重置表单
      this.showDialog = false; //关闭弹层
    },
    //点击编辑
    btnEditRow(row) {
      row.isEdit = true; //改变行的状态
      //更新缓存数据 ->每次点击编辑更新缓存里的数据
      row.editRow.name = row.name;
      row.editRow.state = row.state;
      row.editRow.description = row.description;
    },
    //编辑状态下的确定
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        //下一步操作
        await updateRole({ ...row.editRow, id: row.id });
        //更新成功
        this.$message.success("更新角色成功");
        //更新显示的数据,并且退出编辑状态
        row.name = row.editRow.name;
        row.state = row.editRow.state;
        row.description = row.editRow.description;
        row.isEdit = false; //退出编辑模式
      } else {
        this.$message.warning("角色和描述不能为空");
      }
    },
    //点击删除
    async confirmDel(id) {
      await delRole(id); //后端删除
      this.$message.success("删除角色成功");
      //删除的如果是最后一个数据
      if (this.list.length === 1) this.pageParams.page--;
      this.getRoleList();
    },
    //点击分配角色
    async btnPermission() {
      //跳出弹层
      this.permissionData = transLisToTreeData(await getPermissionList(),0) 
      this.showPermissionDialog = true
    },
  },
};
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
