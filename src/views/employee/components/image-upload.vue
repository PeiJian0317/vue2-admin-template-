<template>
    <el-upload
        class="avatar-uploader"
        action=""
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :http-request="uploadImage"
        >
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
import COS from 'cos-js-sdk-v5'
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
      },
      //选择图片上传 
      uploadImage(params){
        // console.log(params)
        const cos = new COS({
            SecretId:'AKID754zrdfqvseGpDONAnRBoKvkffhbLj1I',
            SecretKey:'DJG3fBYpwupZD1ra6YsMhrrifZJuNtS4'
        })//完成cos对象的初始化
        cos.putObject({
            Bucket:'peijian0317-1322620313', //存储桶的名称
            Region:'ap-guangzhou', //存储桶所在地域名称
            Key: params.file.name, //文件名称
            StorageClass:'STANDARD', //固定值
            Body:params.file //文件对象
        },(err,data) =>{
            //err表示错误信息,data返回信息
            if(data.statusCode === 200 && data.Location){
                //如果状态码200且有地址的话 -->说明拿到了腾讯云返回的地址
                //此时需要通过$emit触发input事件,让组件标签上的v-model实现
                this.$emit('input', 'http://'+ data.Location)
            }else{
                this.$message.error(err)
            }
        })
      }
    }
  }
</script>