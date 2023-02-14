import { v4 as uuidv4 } from "uuid";
//要随机生成一个字符串，且每次执行不能在发生变化，游客身份持久化存储
export const getUUID = () => {
  //先从本地存储中获取uuid（看一下本地存储中是否有）
  let uuid_token = localStorage.getItem("UUIDTOKEN");
  //如果没有我生成
  if (!uuid_token) {
    //生成的游客临时身份
    uuid_token = uuidv4();
    //本地存储存储一次
    localStorage.setItem("UUIDTOKEN", uuid_token);
  }
  return uuid_token;
};
