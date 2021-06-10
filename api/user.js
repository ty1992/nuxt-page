import {request} from '~/plugins/request.js'
/**
 * 登录
 * @param {*} data 
 * @returns {
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
 */
export const loginUser = (data) =>
  request({
    method: "post",
    url: "/users/login",
    data,
  });

/**
 *  当前用户
 * @returns {
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
 */
export const currentUser = () =>
  request({
    url: "/user",
  });

export const updateUser = data =>
  request({
    method: "put",
    url: "/user",
    data
  });

// 注册
export const registerUser = (data) =>
  request({
    method: "post",
    url: "/users",
    data,
  });
