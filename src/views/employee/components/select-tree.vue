<template>
  <el-cascader 
  :options="treeData" 
  size="mini" 
  :props="props" 
  separator="-"
  value="value"
  @change="selectChange"
  />
</template>

<script>
import { getDepartment } from "@/api/department";
import { transLisToTreeData } from "@/utils/index.js";
export default {
  data() {
    return {
      treeData: [], //赋值给级联组件的options
      props: {
        label: "name",
        value: "id",
      },
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment();
      this.treeData = transLisToTreeData(result, 0);
    },
    selectChange(list){
        if(list.length > 0){
            this.$emit('input',list[list.length - 1]) //取出最后一位id
        }else{
            this.$emit('input',null)
        }
    }
  },
};
</script>

<style></style>
