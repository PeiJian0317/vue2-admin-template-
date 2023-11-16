<template>
  <el-dialog title="新增部门" :visible="showDialog" width="30%" @close="close">
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width: 80%" size="mini" />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width: 80%" size="mini">
          <!-- 下拉选项 循环负责人数据 -->
          <el-option v-for="item in ManagerList"
           :key="item.id" 
           :label="item.username"
           :value="item.id"
           >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%" />
      </el-form-item>
      <el-form-item>
        <!-- 按钮 -->
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="btnOK">确定</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {getDepartment,getManagerList,addDepartment,getDepartmentDetail} from '@/api/department'
export default {
  name: "addDeptVue",
  data() {
    return {
      formData: {
        ManagerList:[], // 负责人列表
        code: "", // 部门编码
        introduce: "", // 部门介绍
        managerId: "", // 部门负责人id
        name: "", // 部门名称
        pid: "", // 父级部门的id
      },
      rules: {
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门编码的长度为2-10个字符",
            trigger: "blur",
          },{
            trigger:'blur',
            // 自定义校验模式
            validator:async (rule,value,callback) =>{
              let result = await getDepartment()
              //判断当前是否为编辑模式 ->如为编辑模式则有id
              if(this.formData.id){
                result = result.filter(item => item.id !== this.formData.id)
              }

              //查看result中是否有编码
              if(result.some(item => item.code === value)){
                callback(new Error('部门中已经有编码了'))
              }else{
                callback()
              }
            }
        }
        ], // 部门编码
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "部门介绍的长度为1-100个字符",
            trigger: "blur",
          },
        ], // 部门介绍
        managerId: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ], // 部门负责人id
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门名称的长度为2-10个字符",
            trigger: "blur",
          },
          {
            trigger:'blur',
            //自定义校验规则
            validator: async(rule, value, callback) => {
              // value就是输入的名称
              let result = await getDepartment()
              if (this.formData.id) {
                // 编辑场景 排除自身
                result = result.filter(item => item.id !== this.formData.id)
              }
              // result数组中是否存在 value值
              if (result.some(item => item.name === value)) {
                callback(new Error('部门中已经有该名称了'))
              } else {
                callback()
              }
            }
          }
        ], // 部门名称
        // pid: '' // 父级部门的id 不需要做校验
      },
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    currentID:{
      type: Number,
      default: null
    }
  },
  methods: {
    close() {
      this.$emit("update:showDialog", false);
      this.$refs.addDept.resetFields() //重置表单
    },
    async getManagerList(){
      this.ManagerList = await getManagerList()
    },
    btnOK(){
      this.$refs.addDept.validate(async (isOK) => {
        if(isOK){
          //校验通过
          await addDepartment({ ...this.formData, pid:this.currentID})
          //通知父组件更新 -->利用自定义事件
          this.$emit('updateDepartment')
          //提示消息
          this.$message.success('新增部门成功')
          this.close()
        }
      })
    },
    //获取组织的详情
    async getDepartmentDetail(){
      this.formData = await getDepartmentDetail(this.currentID)
    }
  },
  created(){
    this.getManagerList()
  }
};
</script>

<style></style>
