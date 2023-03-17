import request from '@/utils/request'
import {data} from "autoprefixer";

export default {
  getUserList(searchModel){
    return  request({
      url:'/user/list',
      method:'get',
      params:{
        pageNo:searchModel.pageNo,
        pageSize:searchModel.pageSize,
        username:searchModel.username,
        phone:searchModel.phone
      }
    })
  },
  saveUser(user){
    return  request({
      url:'/user',
      method:'post',
      data:user
    })
  },
  updateUser(user){
    return  request({
      url:'/user',
      method:'put',
      data:user
    })
  },
  judge(user){
    if(user.id==null&&user.id==undefined){
      return this.saveUser(user);
    }return  this.updateUser(user);
  },
  getUserById(id){
    return  request({
      url:`/user/${id}`,
      method:'get'
    })
  },
  deleteUserById(id){
    return  request({
      url:`/user/${id}`,
      method:'delete'
    })
  }
}
