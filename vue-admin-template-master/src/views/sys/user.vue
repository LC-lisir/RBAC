<template>
  <div>
    <!--    查询-->
    <el-card id="search">
      <el-row>
        <el-col :span="12">
          <el-input v-model="searchModel.username" placeholder="请输入用户名"></el-input>
          <el-input v-model="searchModel.phone" placeholder="请输入电话"></el-input>
          <el-button @click="getUserList" type="primary" round>查询</el-button>
        </el-col>
        <el-col :span="12" align="right">
          <el-button type="primary" @click="openEditUI(null)" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--结果列表-->
    <el-card>
      <el-table :data="userList" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="180">
          <template slot-scope="scope">
            {{(searchModel.pageNo-1) * searchModel.pageSize + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="id" label="用户ID" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="phone" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="电子邮件"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="" icon="el-icon-edit"  circle></el-button>
            <el-button @click="deleteUser(scope.row)" type="" icon="el-icon-delete"  circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页组件-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchModel.pageNo"
      :page-sizes="[5, 10, 30, 50]"
      :page-size="searchModel.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    <el-dialog @close="clearForm"  :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="form.id === null|| form.id === undefined"
          label="密码" prop="password"  :label-width="formLabelWidth">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话"   prop="phone" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="email" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" >确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import userApi from '@/api/userManage'

export default {
  methods: {
    clearForm(){
      this.form={};
      this.$refs.form.clearValidate();
    },
    open1() {
      this.$notify({
        title: '成功',
        message: '添加成功',
        type: 'success'
      });
    },
    open4() {
      this.$notify.error({
        title: '错误',
        message: '添加失败，重新输入'
      });
    },
    save(){
      //提交前，前端验证，valid为验证结果
      this.$refs.form.validate((valid) => {
        if (valid) {
          //发送请求
          userApi.judge(this.form).then(response=>{
            //成功的提示信息
            this.open1();
            //刷新表格信息
            this.getUserList()
          })
        } else {
         this.open4()
          return false;
        }
      });

    },
    handleSizeChange(pageSize) {
      this.searchModel.pageSize = pageSize;
      this.getUserList();
    },
    handleCurrentChange(pageNo) {
      this.searchModel.pageNo = pageNo;
      this.getUserList();
    },
    getUserList() {
      userApi.getUserList(this.searchModel).then(response => {
        this.userList = response.data.rows;
        this.total = response.data.total;
      });

    },
    openEditUI(id){
      this.dialogFormVisible=true;
      if (id==null){
        this.title = '新增用户';
      }else{
        this.title = "修改用户";
        userApi.getUserById(id).then(response=>{
          this.form = response.data;
        });
      }
    },
    deleteUser(user){
      this.$confirm(`您确认删除${user.username}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.deleteUserById(user.id).then(response=>{
          this.$message({
            type: 'success',
            message: response.message
          });
          this.getUserList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    }
  },
  created() {
    this.getUserList();
  },
  data() {
    var checkemail = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!reg.test(value)) {
        return callback(new Error("邮箱格式错误"));
      }
       callback();
      }
    let checkphone =(rule, value, callback) => {
      var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (!reg.test(value)) {
        return callback(new Error("手机号格式错误"));
      }
      callback();
    };
    return {
      title:"",
      total: 0,
      searchModel: {
        pageNo: 1,
        pageSize: 10
      },
      userList: [],

      dialogFormVisible: false,
      formLabelWidth: '80px',
      form: {
      },
      rules: {
        username: [
          { required:true,message:'请输入用户名', trigger: 'blur' },//必填项，错误信息，触发事件（失去焦点）
          { min:3,max:20,message:'长度在3到20个字符之间', trigger: 'blur' }
        ],
        password: [
          { required:true,message:'请输入密码', trigger: 'blur' },//必填项，错误信息，触发事件（失去焦点）
          { min:6,max:16,message:'长度在6到16个字符之间', trigger: 'blur' }
        ],
        email: [
          { required:true,message:'请输入邮箱', trigger: 'blur' },
          {validator: checkemail, trigger: 'blur'}
        ],
        phone: [
          {required:true,message:'请输入手机号', trigger: 'blur'},
           { validator: checkphone, trigger: 'blur' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.el-dialog .el-input{
  width: 70%;
}
.el-card {
  margin: 20px;
}

#search .el-input {
  width: 200px;
  margin-right: 10px;

}
</style>
