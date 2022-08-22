<template>
  <div
    id="home"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="拼命加载中"
  >
    <!-- header部分开始 -->
    <div class="header">
      <div class="wrapper w">
        <label for="title">ToDoList</label>
        <input
          type="text"
          name="title"
          id="title"
          placeholder="添加ToDoList"
          v-model="listItem"
          @keyup.enter="addData"
        />
      </div>

      <!-- 登录前开始 -->
      <div class="before-login-header-right" v-show="beforeLoginIsShow">
        <span class="login" @click="popLogin">登录</span>
        <el-dialog
          :visible.sync="loginDialogVisible"
          width="40%"
          :before-close="loginHandleClose"
          destroy-on-close="true"
        >
          <login
            @passLogin="passLogin"
            @verifyCodeLogin="verifyCodeLogin"
          ></login>
        </el-dialog>

        <span class="register" @click="popRegister"> 注册</span>
        <el-dialog
          :visible.sync="registerDialogVisible"
          width="40%"
          :before-close="registerHandleClose"
          destroy-on-close="true"
        >
          <registerpage @registerSuccess="registerSuccess"></registerpage>
        </el-dialog>
      </div>
      <!-- 登录后结束 -->

      <!-- 登录后开始 -->
      <div class="after-login-header-right" v-show="afterLoginIsShow">
        当前用户:
        <el-dropdown>
          <span class="el-dropdown-link"
            >{{ currentUser }}<i class="el-icon-arrow-down el-icon--right"></i
          ></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="bindMobileNumVisible = true"
              >绑定手机号</el-dropdown-item
            >

            <el-dropdown-item divided @click.native="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog
          :visible.sync="bindMobileNumVisible"
          width="40%"
          :before-close="bindMobileNumHandleClose"
          destroy-on-close="true"
        >
          <bind-mobile-num></bind-mobile-num>
        </el-dialog>
      </div>
      <!-- 登录后结束 -->
    </div>
    <!-- header部分结束 -->

    <!-- section部分开始 -->
    <section>
      <div class="inner-section">
        <!-- 正在进行部分 -->
        <div class="inProgress clearfix">
          <h2>
            正在进行<span class="toDoListNum" id="toDoListNum">{{
              toDoListNum
            }}</span>
          </h2>
        </div>

        <div class="onGoing">
          <div class="list-item" v-for="(item, index) in toDoList" :key="item">
            <li class="rect"></li>
            <input type="checkbox" name="" id="" @click="complete(index)" />
            <li class="content">{{ item }}</li>
            <img
              src="../assets/images/circle.png"
              alt=""
              @click="deleteToDoList(index)"
            />
          </div>
        </div>

        <!-- 已经完成部分 -->
        <div class="completed clearfix">
          <h2>
            已经完成<span class="doneListNum" id="doneListNum">{{
              doneListNum
            }}</span>
          </h2>
        </div>

        <div class="done">
          <div
            class="list-item done-list-item"
            v-for="(item, index) in doneList"
            :key="item"
          >
            <li class="rect"></li>
            <input
              type="checkbox"
              name=""
              id=""
              @click="notComplete(index)"
              checked
            />
            <li class="content">{{ item }}</li>
            <img
              src="../assets/images/circle.png"
              alt=""
              @click="deleteDoneList(index)"
            />
          </div>
        </div>
      </div>
    </section>
    <!-- section部分结束 -->

    <!-- footer部分开始 -->
    <footer class="w">Copyright © 2014 todolist.cn</footer>
    <!-- footer部分结束 -->
  </div>
</template>

<script>
import login from "./login.vue";
import registerpage from "./registerpage.vue";
import bindMobileNum from "./bindMobileNum.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    login,
    registerpage,
    bindMobileNum,
  },
  data() {
    return {
      listItem: "",
      toDoList: [],
      doneList: [],
      toDoListId: [],
      doneListId: [],
      isSame: false,
      loginDialogVisible: false,
      registerDialogVisible: false,
      currentUser: "",
      beforeLoginIsShow: true,
      afterLoginIsShow: false,
      bindMobileNumVisible: false,
      fullscreenLoading: false,
    };
  },
  created() {
    let hasUserName = localStorage.getItem("username");
    if (hasUserName) {
      this.beforeLoginIsShow = false;
      this.afterLoginIsShow = true;
      this.currentUser = hasUserName;
      this.getAllToDo();
    } else {
      let toDoListObj = JSON.parse(localStorage.getItem("toDoList"));
      if (toDoListObj == null) {
        this.toDoList = [];
      } else {
        this.toDoList = toDoListObj;
      }

      let doneListObj = JSON.parse(localStorage.getItem("doneList"));
      if (doneListObj == null) {
        this.doneList = [];
      } else {
        this.doneList = doneListObj;
      }
    }
  },
  computed: {
    toDoListNum() {
      console.log(this.toDoList);
      return this.toDoList.length;
    },
    doneListNum() {
      return this.doneList.length;
    },
  },
  methods: {
    // 判断新增的todo是否全为空格
    isAllBlank() {
      for (let i = 0; i < this.listItem.length; i++) {
        if (this.listItem[i] !== " ") {
          return false;
        }
      }
      return true;
    },
    // 发送网络请求获取所有待办和已办事项并渲染到页面
    getAllToDo() {
      axios
        .get("/api/alltodos")
        .then((res) => {
          this.toDoList = [];
          this.doneList = [];
          this.toDoListId = [];
          this.doneListId = [];

          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].todoStatus == 0) {
              this.toDoList.push(res.data[i].content);
              this.toDoListId.push(res.data[i].id);
            } else if (res.data[i].todoStatus == 1) {
              this.doneList.push(res.data[i].content);
              this.doneListId.push(res.data[i].id);
            }
          }
          this.fullscreenLoading = false;
        })
        .catch((err) => {
          if (err.response.status == 401) {
            this.$message({
              type: "error",
              message: "登录过期，请重新登录再试",
            });
            this.fullscreenLoading = false;
            this.beforeLoginIsShow = true;
            this.afterLoginIsShow = false;
            localStorage.removeItem("username");
          } else {
            this.$message({
              type: "error",
              message: "网络错误",
            });
          }
        });
    },
    // 登录后发送localStorage数据到后端
    sendData() {
      let listArr = [];
      for (let i = 0; i < this.toDoList.length; i++) {
        let obj = {};
        obj.content = this.toDoList[i];
        obj.todoStatus = 0;
        listArr.push(obj);
      }
      for (let j = 0; j < this.doneList.length; j++) {
        let obj = {};
        obj.content = this.doneList[j];
        obj.todoStatus = 1;
        listArr.push(obj);
      }
      axios
        .post("/api/batchsave", listArr)
        .then((res) => {
          localStorage.setItem("toDoList", "[]");
          localStorage.setItem("doneList", "[]");
          this.getAllToDo();
        })
        .catch((err) => {
          // console.log(err);
          this.$message({
            type: "error",
            message: "网络错误，请重新登录再试",
          });
        });
    },
    // 登录后保存用户名到localStorage
    afterLogin() {
      localStorage.setItem("username", this.currentUser);
    },

    // 来自子组件bindMobileNum的事件
    bindMobileNumSuccess() {
      this.bindMobileNumVisible = false;
    },
    // 退出登录
    logout() {
      this.$confirm("确认退出登录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios
            .post("/api/logout")
            .then((res) => {
              this.$message({
                type: "success",
                message: "登出成功!",
              });
              this.beforeLoginIsShow = true;
              this.afterLoginIsShow = false;
              this.toDoList = [];
              this.doneList = [];
              localStorage.removeItem("username");
            })
            .catch((err) => {
              if (err.response.status == 401) {
                this.$message({
                  type: "error",
                  message: "登录过期，请重新登录再试",
                });
                this.fullscreenLoading = false;
                this.beforeLoginIsShow = true;
                this.afterLoginIsShow = false;
                localStorage.removeItem("username");
              } else {
                this.$message({
                  type: "error",
                  message: "网络错误",
                });
              }
            });
        })
        .catch(() => {});
    },
    // 来自孙组件passwordLogin的事件
    passLogin(username) {
      this.loginDialogVisible = false;
      this.currentUser = username;
      this.beforeLoginIsShow = false;
      this.afterLoginIsShow = true;
      this.afterLogin();
      this.sendData();
    },
    // 来自孙组件verifyCodeLogin的事件
    verifyCodeLogin(username) {
      this.loginDialogVisible = false;
      this.currentUser = username;
      this.beforeLoginIsShow = false;
      this.afterLoginIsShow = true;
      this.afterLogin();
      this.sendData();
    },
    // 来自子组件registerpage的事件
    registerSuccess() {
      this.registerDialogVisible = false;
    },
    popLogin() {
      this.loginDialogVisible = true;
    },
    popRegister() {
      this.registerDialogVisible = true;
    },
    loginHandleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    registerHandleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    bindMobileNumHandleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 添加待办事项
    addData() {
      //   console.log(this.listItem.length);
      for (let i = 0; i < this.toDoList.length; i++) {
        if (this.toDoList[i] == this.listItem) {
          this.isSame = true;
          break;
        }
      }

      if (this.isSame == true) {
        this.$message.error("该待办事项已存在");
        this.isSame = false;
      } else {
        if (this.listItem.length !== 0) {
          if (this.isAllBlank()) {
            this.$message.error("待办事项不能为空");
            return;
          }
          this.currentUser = localStorage.getItem("username");
          if (this.currentUser == "") {
            this.toDoList.push(this.listItem);
            // console.log(JSON.stringify(this.toDoList));
            let addNewItem = JSON.stringify(this.toDoList);
            localStorage.setItem("toDoList", addNewItem);
            this.listItem = "";
          } else {
            this.fullscreenLoading = true;
            let obj = {};
            obj.content = this.listItem;
            this.listItem = "";
            axios
              .post("/api/addtodo", obj)
              .then((res) => {
                this.getAllToDo();
              })
              .catch((err) => {
                // console.log(err.response.status);
                if (err.response.status == 401) {
                  this.$message({
                    type: "error",
                    message: "网络错误，请重新登录再试",
                  });
                  this.fullscreenLoading = false;
                  this.beforeLoginIsShow = true;
                  this.afterLoginIsShow = false;
                  localStorage.removeItem("username");
                } else {
                  this.$message({
                    type: "error",
                    message: "网络错误",
                  });
                }
              });
          }
        } else {
          this.$message.error("待办事项不能为空");
        }
      }
    },

    // 本地储存
    complete(index) {
      this.currentUser = localStorage.getItem("username");
      if (this.currentUser == "") {
        this.doneList.push(this.toDoList[index]);
        this.toDoList.splice(index, 1);

        let completeToDoList = JSON.stringify(this.toDoList);
        localStorage.setItem("toDoList", completeToDoList);
        let addDoneList = JSON.stringify(this.doneList);
        localStorage.setItem("doneList", addDoneList);
      } else {
        this.fullscreenLoading = true;
        axios
          .post("/api/completetodo", {
            Id: this.toDoListId[index],
            content: this.toDoList[index],
          })
          .then((res) => {
            this.getAllToDo();
          })
          .catch((err) => {
            this.fullscreenLoading = false;
            if (err.response.status == 401) {
              this.$message({
                type: "error",
                message: "登录过期，请重新登录再试",
              });
              this.fullscreenLoading = false;
              this.beforeLoginIsShow = true;
              this.afterLoginIsShow = false;
              localStorage.removeItem("username");
            } else {
              this.$message({
                type: "error",
                message: "网络错误",
              });
            }
          });
      }
    },
    notComplete(index) {
      this.currentUser = localStorage.getItem("username");
      if (this.currentUser == "") {
        this.toDoList.push(this.doneList[index]);
        this.doneList.splice(index, 1);

        let notCompleteDoneList = JSON.stringify(this.doneList);
        localStorage.setItem("doneList", notCompleteDoneList);
        let addToDoList = JSON.stringify(this.toDoList);
        localStorage.setItem("toDoList", addToDoList);
      } else {
        this.fullscreenLoading = true;
        axios
          .post("/api/undotodo", {
            id: this.doneListId[index],
            content: this.doneList[index],
          })
          .then((res) => {
            this.getAllToDo();
          })
          .catch((err) => {
            this.fullscreenLoading = false;
            if (err.response.status == 401) {
              this.$message({
                type: "error",
                message: "登录过期，请重新登录再试",
              });
              this.fullscreenLoading = false;
              this.beforeLoginIsShow = true;
              this.afterLoginIsShow = false;
              localStorage.removeItem("username");
            } else {
              this.$message({
                type: "error",
                message: "网络错误",
              });
            }
          });
      }
    },
    deleteToDoList(index) {
      this.currentUser = localStorage.getItem("username");
      if (this.currentUser == "") {
        this.toDoList.splice(index, 1);
        let deleteToDoListJson = JSON.stringify(this.toDoList);
        localStorage.setItem("toDoList", deleteToDoListJson);
      } else {
        this.fullscreenLoading = true;
        axios
          .post("/api/deltodo", {
            id: this.toDoListId[index],
            content: this.toDoList[index],
          })
          .then((res) => {
            this.getAllToDo();
          })
          .catch((err) => {
            this.fullscreenLoading = false;
            if (err.response.status == 401) {
              this.$message({
                type: "error",
                message: "登录过期，请重新登录再试",
              });
              this.fullscreenLoading = false;
              this.beforeLoginIsShow = true;
              this.afterLoginIsShow = false;
              localStorage.removeItem("username");
            } else {
              this.$message({
                type: "error",
                message: "网络错误",
              });
            }
          });
      }
    },
    deleteDoneList(index) {
      this.currentUser = localStorage.getItem("username");
      if (this.currentUser == "") {
        this.doneList.splice(index, 1);
        let deleteDoneListJson = JSON.stringify(this.doneList);
        localStorage.setItem("doneList", deleteDoneListJson);
      } else {
        this.fullscreenLoading = true;
        axios
          .post("/api/deltodo", {
            id: this.doneListId[index],
            content: this.doneList[index],
          })
          .then((res) => {
            this.getAllToDo();
          })
          .catch((err) => {
            this.fullscreenLoading = false;
            if (err.response.status == 401) {
              this.$message({
                type: "error",
                message: "登录过期，请重新登录再试",
              });
              this.fullscreenLoading = false;
              this.beforeLoginIsShow = true;
              this.afterLoginIsShow = false;
              localStorage.removeItem("username");
            } else {
              this.$message({
                type: "error",
                message: "网络错误",
              });
            }
          });
      }
    },
  },
};
</script>

<style scoped>
/* header部分开始 */
.header {
  position: relative;
  height: 50px;
  background-color: #323232;
}

.before-login-header-right {
  position: absolute;
  top: 18px;
  right: 15px;
  color: #ddd;
}

.after-login-header-right {
  position: absolute;
  top: 18px;
  right: 15px;
  color: #ddd;
}

.el-dropdown-link {
  cursor: pointer;
  color: #fcd07f;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.register {
  margin-left: 5px;
}

.login:hover {
  cursor: pointer;
  color: #fff;
}

.register:hover {
  cursor: pointer;
  color: #fff;
}

.w {
  width: 597px;
}

.header .wrapper {
  height: 45px;
  margin: 0 auto;
}

.header .wrapper label {
  float: left;
  line-height: 50px;
  width: 100px;
  height: 50px;
  font-size: 23px;
  color: #dddddd;
  cursor: pointer;
}

.header input {
  float: right;
  padding-left: 10px;
  box-shadow: 0 2px 0 #757575;
  border-radius: 5px;
  margin: 12px 0 0 130px;
  width: 350px;
  height: 25px;
}

/* section部分开始 */
section {
  width: 100%;
  /* height: 120px;  不方便给高度*/
}

.inner-section {
  width: 597px;
  margin: 0 auto;
}

.inner-section span {
  float: right;
  width: 22px;
  height: 22px;
  line-height: 22px;
  background-color: #e6e6fa;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #666666;
  border-radius: 50%;
}

.list-item {
  display: block;
  position: relative;
  width: 600px;
  height: 30px;
  background-color: #fff;
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  cursor: move;
  margin-bottom: 10px;
}

.rect {
  width: 5px;
  height: 30px;
  background-color: #629a9c;
}

.list-item input {
  position: absolute;
  left: 14px;
  top: 4px;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.content {
  position: absolute;
  left: 48px;
  top: 0;
  width: 530px;
  height: 30px;
  line-height: 30px;
}

.list-item img {
  position: absolute;
  top: 4px;
  right: 7px;
  width: 22px;
  height: 22px;
  cursor: pointer;
}

.inner-section h2 {
  float: left;
  width: 597px;
  height: 22px;
  line-height: 22px;
}

.inner-section span {
  float: right;
  width: 22px;
  height: 22px;
  line-height: 22px;
  background-color: #e6e6fa;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #666666;
  border-radius: 50%;
}

.done-list-item {
  margin-bottom: 10px;
  cursor: default;
  opacity: 0.5;
}
/* section部分结束 */

/* footer部分开始 */
footer {
  margin: 0 auto;
  margin-top: 30px;
  color: #666666;
  text-align: center;
  font-size: 14px;
}
</style>