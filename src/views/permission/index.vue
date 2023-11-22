<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0,1)">添加权限</el-button>
      <!-- 放着弹层 -->
      <el-dialog :title="`${showText}权限点`" :visible.sync="dialogVisible" width="600px" @close="close">
        <el-form
          ref="permissionForm"
          :model="perFrom"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input style="width: 400px" v-model="perFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input style="width: 400px" v-model="perFrom.code"></el-input>
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input
              style="width: 400px"
              v-model="perFrom.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="开启" prop="enVisible">
            <el-switch size="mini" v-model="perFrom.enVisible" :active-value="1"
            :inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-row type="flex" justify="center">
              <el-col :span="12">
                <el-button type="primary" size="mini" @click="btnOK"
                  >确定</el-button
                >
                <el-button size="mini" @click="btnCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-table :data="list" row-key="id" :default-expand-all="true">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" size="mini" @click="addPermission(1,2)"
              >添加</el-button
            >
            <el-button type="text" size="mini" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getPermissionList,addPermission,getPermissionDetail,updatePermission,delPermission } from "@/api/permission";
import { transLisToTreeData } from "@/utils";
export default {
  name: "Permission",
  data() {
    return {
      list: [], //数据
      dialogVisible: false, //弹层状态
      perFrom: {
        name: "", //权限点名字
        code: "", //权限点标识
        description: "", //权限点描述
        type:null, //权限点类型
        pid:null, //权限点父级id 
        enVisible: 0, //0关闭, 1开启
      },
      rules: {
        name: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "权限标识不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    showText() {
      return this.perFrom.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      const result = await getPermissionList();
      this.list = transLisToTreeData(result, 0);
    },
    //点击dialog的×触发的事件
    close(){
      this.btnCancel()
    },
    //点击添加权限按钮 ---> 该按钮是用来添加一级权限的
    addPermission(pid,type){
      this.perFrom.pid = pid //一级权限的pid都是0
      this.perFrom.type = type //一级权限的type都是1
      this.dialogVisible = true
    },
    //点击确定按钮
    btnOK(){
      this.$refs.permissionForm.validate(async (isOK) =>{
        //校验通过
        //判断是否为编辑模式
        if(isOK){
          //有id为编辑模式
          if(this.perFrom.id){
            await updatePermission(this.perFrom)
            this.$message.success('修改编辑成功')
          }else{
            await addPermission(this.perFrom)
            this.$message.success('新增成功')
          }
          this.dialogVisible = false
          this.getPermissionList()
          this.btnCancel()
        }else{
          this.$message.error('表单校验不通过,请检查表单!')
        }
      })
    },
    //点击取消按钮
    btnCancel(){
      //关闭弹层+清除表单
      this.perFrom = {
        name: "", //权限点名字
        code: "", //权限点标识
        description: "", //权限点描述
        type:null, //权限点类型
        pid:null, //权限点父级id 
        enVisible: 0, //0关闭, 1开启
      },
      this.$refs.permissionForm.resetFields()
      this.dialogVisible = false
    },
    //点击编辑按钮 -->根据id查询参数
    async editPermission(id){
      this.perFrom = await getPermissionDetail(id)
      this.dialogVisible = true
    },
    //点击删除按钮 -->根据id删除
    async delPermission(id){
      try{
        await this.$confirm('确认要删除该数据吗?')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      }catch(error){
        console.log(error)
      }
    }
  },
};
</script>
