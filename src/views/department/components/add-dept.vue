<template>
  <el-dialog
    title="新增部门"
    :visible="showDialog"
    width="30%"
    @close="close"
  >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <el-button>取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
   name:'addDeptVue',
   props:{
    showDialog:{
        type:Boolean,
        default:false
    }
   },
   methods:{
    close(){
      this.$emit('update:showDialog',false)
    }
   }
};
</script>

<style></style>
