<template>
  <div id="home">
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
      <div class="header-right">
        <span class="login" @click="popLogin">登录</span>
        <el-dialog
          :visible.sync="loginDialogVisible"
          width="40%"
          :before-close="loginHandleClose"
          destroy-on-close="true"
        >
          <login @passLogin="passLogin"></login>
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

export default {
  name: "Home",
  components: {
    login,
    registerpage,
  },
  data() {
    return {
      listItem: "",
      toDoList: [],
      doneList: [],
      isSame: false,
      loginDialogVisible: false,
      registerDialogVisible: false,
    };
  },
  created() {
    // console.log(localStorage.getItem("toDoList"));
    let toDoListObj = JSON.parse(localStorage.getItem("toDoList"));
    this.toDoList = toDoListObj;

    let doneListObj = JSON.parse(localStorage.getItem("doneList"));
    this.doneList = doneListObj;
  },
  computed: {
    toDoListNum() {
      return this.toDoList.length;
    },
    doneListNum() {
      return this.doneList.length;
    },
  },
  methods: {
    // 来自孙组件passwordLogin的事件
    passLogin() {
      this.loginDialogVisible = false;
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
          this.toDoList.push(this.listItem);
          // console.log(JSON.stringify(this.toDoList));
          let addNewItem = JSON.stringify(this.toDoList);
          localStorage.setItem("toDoList", addNewItem);
          this.listItem = "";
          this.isSame = false;
        } else {
          this.$message.error("待办事项不能为空");
        }
      }
    },

    // 本地储存
    complete(index) {
      // console.log(this.toDoList[index]);
      this.doneList.push(this.toDoList[index]);
      this.toDoList.splice(index, 1);

      let completeToDoList = JSON.stringify(this.toDoList);
      localStorage.setItem("toDoList", completeToDoList);
      let addDoneList = JSON.stringify(this.doneList);
      localStorage.setItem("doneList", addDoneList);
    },
    notComplete(index) {
      this.toDoList.push(this.doneList[index]);
      this.doneList.splice(index, 1);

      let notCompleteDoneList = JSON.stringify(this.doneList);
      localStorage.setItem("doneList", notCompleteDoneList);
      let addToDoList = JSON.stringify(this.toDoList);
      localStorage.setItem("toDoList", addToDoList);
    },
    deleteToDoList(index) {
      this.toDoList.splice(index, 1);
      // console.log(this.toDoList);
      let deleteToDoListJson = JSON.stringify(this.toDoList);
      localStorage.setItem("toDoList", deleteToDoListJson);
    },
    deleteDoneList(index) {
      this.doneList.splice(index, 1);
      let deleteDoneListJson = JSON.stringify(this.doneList);
      localStorage.setItem("doneList", deleteDoneListJson);
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

.header-right {
  position: absolute;
  top: 18px;
  right: 15px;
  color: #ddd;
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