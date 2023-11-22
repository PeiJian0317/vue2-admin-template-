<template>
    <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>


<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
  export default {
    props:{
        value:{
            type:String,
            default:''
        }
    },
    methods: {
      //文件上传前的钩子,检查上传的图片是否符合格式要求
      beforeAvatarUpload(file) {
        const isJPG = ['image/jpeg','image/png','image/gif','image/bmp'].includes(file.type)
        const isLt5M = file.size / 1024 / 1024 < 5; //5M

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt5M;
      }
    }
  }
</script>