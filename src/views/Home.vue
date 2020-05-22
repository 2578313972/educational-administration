<template>
  <div id="Home">
    <el-container>
      <el-aside width="auto" style="background:rgb(84, 92, 100)" >
        <div id="HomeLeft">
          <el-menu
          background-color="#FFEB3A"
          class="el-menu-vertical-demo top-el-menu"
          :collapse="isCollapse"
          >
            <el-menu-item class="tl-item">
                <img class="img asideImg" src="../assets/logo.png" />
                <span style="color:#24A33A;">自学无忧教育</span>
            </el-menu-item>
          </el-menu>
          <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-vertical-demo"
          router
          @select="select"
          :default-active="active"
          :collapse="isCollapse">
            <el-submenu :index="index.toString()" v-for="(item, index) in selectData" :key="item.name">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.name}}</span>
              </template>
              <el-menu-item-group>
                  <el-menu-item v-for="(data, index2) in item.data" :key="index2"  :index="data.url">{{data.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <div id="HomeRight">
          <div class="arrows" @click="isCollapse = !isCollapse"><span :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></span></div>
          <div class="account">
              <el-row class="block-col-2">
                <el-col :span="12">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-s-custom"></i>退出
                      <div class="account_1">
                        <div class="demo-type">
                          <el-avatar :size="60" :src="img" @error="errorHandler">
                            <img class="img" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                          </el-avatar>
                        </div>
                      </div>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-plus"><span @click="backLogin">退出登录</span></el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
          </div>

          <el-tabs v-model="editableTabsValue" type="card" @tab-click="clickTab" @tab-remove="removeTab">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="item.title==='首页'?false:true"
            >
            </el-tab-pane>
            <div ref="main" class="main">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/' }"><span @click="goIndex">首页</span></el-breadcrumb-item>
                  <el-breadcrumb-item v-if="Crumb_first">{{Crumb_first}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="Crumb_second && $route.path!=='/BPaperZJ'&& $route.path!=='/BReadoverZJ'" >{{Crumb_second}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/BPaper' }" v-if="Crumb_second && $route.path==='/BPaperZJ'" >{{Crumb_second}}</el-breadcrumb-item>
                    <el-breadcrumb-item  v-if="$route.path==='/BPaperZJ'" >维护试卷题目</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/BReadover' }" v-if="Crumb_second && $route.path==='/BReadoverZJ'" >测试任务</el-breadcrumb-item>
                    <el-breadcrumb-item  v-if="$route.path==='/BReadoverZJ'" >批阅试卷</el-breadcrumb-item>
              </el-breadcrumb>
              <router-view />
            </div>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      userData:null, // 用户数据
      img:'',
      height:0, // 定义左边菜单栏高度
      active:'', // 左侧菜单栏选中目标
      isCollapse:false, // 缩展
      selectData:[], // 菜单栏选择数据
      editableTabs: [], // Tab页数据
      tabIndex: 1, // 不断变化的name值
      editableTabsValue:"1", // 默认显示（Tab标签）
      Crumb_first:'', // 面包屑数据1
      Crumb_second:'', // 面包屑数据2
      historyActive:[] // 历史路由
    }
  },
  created() {
    this.selectData = [
      {name:"基础数据",data:[
        {url:"/FClass",name:"班级管理"},
        {url:"/FStudent",name:"学生管理"},
        {url:"/FTeacher",name:"用户管理"},
        {url:"/FRole",name:"用户角色"},
        {url:"/FPassword",name:"修改密码"}
      ]},{name:"在线测试",data:[
        {url:"/BMakePaper",name:"老师出卷"},
        {url:"/BPaper",name:"试卷管理"},
        {url:"/BArrange",name:"安排测试"},
        {url:"/BReadover",name:"批阅试卷"},
        {url:"/BTest",name:"测试成绩"}
      ]}
    ]
    this.editableTabs = [
      {title: '首页', name: '1',url:'/'}
    ]
    this.height = window.innerHeight; // 获取屏幕高度给左菜单栏 和 路由视图
    this.userData = JSON.parse(sessionStorage.getItem('userData')) // 获取登录用户数据
    try {
      this.img = this.userData.userHeader
    } catch (error) {}
    this.active = this.$route.fullPath; // 改变左菜单栏目标
  },
  beforeMount() {
    for (let i in this.selectData) { // 循环遍历相同的路由并创建tab切换页
      for (let j in this.selectData[i].data) {
        if(this.selectData[i].data[j].url === this.$route.fullPath){
          /**
           * 获取菜单栏和tab name值
           */
          this.editableTabs.push({title:this.selectData[i].data[j].name,name:++this.tabIndex+"",url:this.$route.fullPath})
          this.historyActive.unshift(this.tabIndex+"")
          this.editableTabsValue = this.tabIndex+""
          /**
           *获取面包屑数据
           */
          this.Crumb_first = this.selectData[i].name
          this.Crumb_second = this.selectData[i].data[j].name
        }
      }
    }
  },
  watch: {
    $route(to,from){
      if(to.fullPath==="/"){
        this.Crumb_first = ''
        this.Crumb_second = ''
      }
      for (let i in this.selectData) { // 循环遍历相同的路由并创建tab切换页
        for (let j in this.selectData[i].data) {
          if(this.selectData[i].data[j].url === to.fullPath){
            /**
             *监听获取面包屑数据
            */
            this.Crumb_first = this.selectData[i].name
            this.Crumb_second = this.selectData[i].data[j].name
          }
        }
      }
      this.historyActive.unshift(this.editableTabsValue)
      this.historyActive = [...new Set(this.historyActive)]
    }
  },
  mounted() {
    this.isCollapse = true
  },
  methods:{
    select(url,e){ // 点击添加Tab数据
      this.selectData[e[0]].data.forEach((element,index) => {
        if(element.url===url){
          let data = this.selectData[e[0]].data[index]
          for (const key in this.editableTabs) {
            if (this.editableTabs[key].title === element.name){
               this.editableTabsValue = this.editableTabs[key].name
               return
            }
          }
          this.editableTabs.push({title: data.name, name: ++this.tabIndex+"",url:data.url})
          this.editableTabsValue = this.tabIndex.toString()
        }
      });
    },
    clickTab(e,index){ // 点击Tab数据
      if(this.$route.path!==this.editableTabs[e.index].url) this.$router.push(this.editableTabs[e.index].url)
      this.active = this.editableTabs[e.index].url
    },
    removeTab(name){ // 删除Tab数据
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === name) {
        let historyActiveName = this.historyActive[1]
          if(!historyActiveName){
            this.active = '/';
            this.editableTabsValue = '1';
            this.$router.push('/');
            this.editableTabs = tabs.filter(tab => tab.name !== name);
            this.historyActive = this.historyActive.filter(tab => tab !== name);
            return
          }
          tabs.forEach((tab, index) => {
            if(tab.name === historyActiveName){
              let nextTab = tabs[index];
              this.active = nextTab.url;
              this.editableTabsValue = nextTab.name;
              this.$router.push(nextTab.url);
            }
          });
      }
      this.editableTabs = tabs.filter(tab => tab.name !== name);
      this.historyActive = this.historyActive.filter(tab => tab !== name);
    },
    goIndex(){ // 回首页
      this.editableTabsValue = "1"
      this.active = ''
    },
    backLogin(){ // 退出登录
      this.Cookie.removeCookie("token")
      this.$router.push({path:"/login",query: {redirect: this.$route.fullPath}})
    },
    errorHandler() {
      return true
    }
  },
}
</script>

<style lang="less" scoped >
  #Home{
    .el-main{padding:0px;}
    #HomeLeft{
        .asideImg{width: 50px;height: 50px;margin: auto 5px;}
        .font{color: #24A33A;font-weight: 600;font-size: 18px;}
        .el-menu{border-right:0px;}
        .el-menu-item.is-active{background-color: rgb(67,74,80) !important;}
        .el-menu-vertical-demo.top-el-menu{height: 60px;}
        .el-menu-vertical-demo.top-el-menu .el-menu-item.tl-item{background-color: rgb(255, 235, 58) !important;line-height: 60px;font-weight: 600;font-size: 19px;}
        .tl-item{
            padding: 0px !important;
        }
        .el-menu-vertical-demo:not(.el-menu--collapse) {
            width: 200px;
        }
    }
    #HomeRight{
        position: relative;
        .arrows{
            width: 40px;
            line-height: 60px;
            position: absolute;
            text-align: center;
            font-size: 30px;
            left: 0px;
            top: 0px;
            z-index: 2;
            color: white;
            background-color: #008181;
            cursor: pointer;
        }
        .account{
            width: 120px;
            height: 60px;
            background-color: white;
            cursor: pointer;
            position: absolute;
            z-index: 3;
            font-size: 30px;
            right: 0px;
            top: 0px;
            overflow: hidden;
            .block-col-2.el-row{
              height: 100%;
              .el-col.el-col-12{
                width:100%;
                height:100%;
                .el-dropdown{
                  width:100%;
                  height: 100%;
                  .el-dropdown-link.el-dropdown-selfdefine{
                    width:100%;
                    height:100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform: translateY(-1px);
                    font-size: 15px;
                    border-bottom: 1px solid #E4E7ED;
                    i{font-size: 16px;}
                    .account_1{
                      width:45px;
                      height: 45px;
                      margin-left: 2px;
                      line-height: 3.8;
                      border-radius: 50%;
                      overflow: hidden;
                      text-align: center;
                    }
                    .demo-type,.el-avatar--circle{width: 100% !important;height: 100% !important;}
                  }
                }
              }
            }
        }
        .el-tabs.el-tabs--card.el-tabs--top{
            padding-top: 19px;
        }
        /deep/ .el-tabs__header.is-top{
            width: 100%;
            min-width: 370px;
            box-sizing: border-box;
            padding-left: 50px;
            padding-right: 120px;
            margin:0;
        }
    }
    .main{
      height: calc(100vh - 60px);
      padding: 25px 25px 10px 25px;
      box-sizing: border-box;
      overflow-x: hidden;
      .el-breadcrumb{margin-bottom: 25px;}
    }
  }
</style>