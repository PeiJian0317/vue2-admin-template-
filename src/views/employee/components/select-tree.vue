<template>
  <el-cascader 
  :options="treeData" 
  size="mini" 
  :props="props" 
  separator="-"
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
  },
};
</script>

<style></style>
