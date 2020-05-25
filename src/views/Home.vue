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
                <span style="color:#24A33A;">{{ $t('Home.title') }}</span>
            </el-menu-item>
          </el-menu>
          <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          class="el-menu-vertical-demo"
          router
          :default-active="active"
          :collapse="isCollapse">
            <el-submenu :index="index.toString()" v-for="(item, index) in selectData" :key="item.name">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{$t(item.name)}}</span>
              </template>
              <el-menu-item-group>
                  <el-menu-item v-for="(data, index2) in item.data" :key="index2"  :index="data.url">{{$t(data.name)}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <div id="HomeRight">
          <div class="arrows" @click="isCollapse = !isCollapse"><span :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></span></div>
            <!--  -->
            <div class="ZHEN">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  {{language}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="zh(),language='简体中文'">简体中文</el-dropdown-item>
                  <el-dropdown-item @click.native="en(),language='English'">English</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!--  -->
          <div class="account">
              <el-row class="block-col-2">
                <el-col :span="12">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-s-custom"></i><span class="name">{{this.name}}</span>
                      <div class="account_1">
                        <div class="demo-type">
                          <el-avatar :size="60" :src="img">
                            <img class="img" src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                          </el-avatar>
                        </div>
                      </div>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-upload" @click.native="centerDialogVisible=true">{{$t('Home.avatar')}}</el-dropdown-item>
                      <el-dropdown-item icon="el-icon-plus" @click.native="backLogin">{{$t('Home.out')}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
          </div>

          <el-tabs v-model="editableTabsValue" type="card" @tab-click="clickTab" @tab-remove="removeTab">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="$t(item.title)"
              :name="item.name"
              :closable="item.name==='1'?false:true"
            >
            </el-tab-pane>
            <div ref="main" class="main">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                  <el-breadcrumb-item :to="{ path: '/' }">{{$t('Home.index')}}</el-breadcrumb-item>
                  <el-breadcrumb-item v-if="Crumb_first">{{$t(Crumb_first)}}</el-breadcrumb-item>
                    <el-breadcrumb-item v-if="Crumb_second && $route.path!=='/BPaperZJ'&& $route.path!=='/BReadoverZJ'" >{{$t(Crumb_second)}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/BPaper' }" v-if="Crumb_second && $route.path==='/BPaperZJ'" >{{$t(Crumb_second)}}</el-breadcrumb-item>
                    <el-breadcrumb-item  v-if="$route.path==='/BPaperZJ'" >{{$t('Home.testquestions')}}</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path:'/BReadover' }" v-if="Crumb_second && $route.path==='/BReadoverZJ'" >{{$t('Home.testtask')}}</el-breadcrumb-item>
                    <el-breadcrumb-item  v-if="$route.path==='/BReadoverZJ'" >{{$t('Home.BReadover')}}</el-breadcrumb-item>
              </el-breadcrumb>

              <transition name="fade">
                  <router-view />
              </transition>
            </div>
          </el-tabs>
        </div>
      </el-main>
    </el-container>

    <el-dialog title="设置头像" :visible.sync="centerDialogVisible" center>
      <el-upload
        action
        list-type="picture-card"
        drag
        :http-request='success'
      >
        <i class="el-icon-plus"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
  </el-dialog>
  </div>
</template>

<script>
import Api from '../http/Home'
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
      historyActive:[], // 历史路由
      centerDialogVisible:false, // set头像弹框
      language:'',
      name:'',
    }
  },
  created() {
    this.selectData = [
      {name:"Home.Basics",data:[
        {url:"/FClass",name:"Home.FClass"},
        {url:"/FStudent",name:"Home.FStudent"},
        {url:"/FTeacher",name:"Home.FTeacher"},
        {url:"/FRole",name:"Home.FRole"},
        {url:"/FPassword",name:"Home.FPassword"}
      ]},{name:"Home.test",data:[
        {url:"/BMakePaper",name:"Home.BMakePaper"},
        {url:"/BPaper",name:"Home.BPaper"},
        {url:"/BArrange",name:"Home.BArrange"},
        {url:"/BReadover",name:"Home.BReadover"},
        {url:"/BTest",name:"Home.BTest"}
      ]}
    ]
    this.editableTabs = [
      {title: 'Home.index', name: '1',url:'/'}
    ]
    this.height = window.innerHeight; // 获取屏幕高度给左菜单栏 和 路由视图
    this.userData = JSON.parse(sessionStorage.getItem('userData')) // 获取登录用户数据
    if(/\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/.test(this.userData.userHeader)) this.img = this.userData.userHeader

    this.name = this.userData.userName
    this.active = this.$route.path; // 改变左菜单栏目标
  },
  beforeMount() {
    for (let i in this.selectData) { // 循环遍历相同的路由并创建tab切换页
      for (let j in this.selectData[i].data) {
        if(this.selectData[i].data[j].url === this.$route.path){
          /** 获取菜单栏和tab name值 */
          this.editableTabs.push({title:this.selectData[i].data[j].name,name:++this.tabIndex+"",url:this.$route.fullPath})
          this.historyActive.unshift(this.tabIndex+"")
          this.editableTabsValue = this.tabIndex+""
          /** 获取面包屑数据 */
          this.Crumb_first = this.selectData[i].name
          this.Crumb_second = this.selectData[i].data[j].name
        }
      }
    }
  },
  watch: {
    $route(to,from){
      if(to.path==="/"){
        this.Crumb_first = ''
        this.Crumb_second = ''
        this.editableTabsValue = '1'
        this.active = to.path
        return
      }

      for (let i in this.selectData) { // 循环遍历相同的路由并创建tab切换页
        for (let j in this.selectData[i].data) {
          if(this.selectData[i].data[j].url === to.path){
            /** 监听获取面包屑数据 */
            this.Crumb_first = this.selectData[i].name
            this.Crumb_second = this.selectData[i].data[j].name
            /** 点击返回 切换Tab页数据的样式、左菜单栏样式、如果没有Tab页数据则添加添加一个新的数据 */
            if(!this.editableTabs.find(item=>item.url === this.selectData[i].data[j].url)) this.editableTabs.push({title:this.selectData[i].data[j].name,name:++this.tabIndex+"",url:to.fullPath});
            this.editableTabsValue = this.editableTabs.find(item=>item.url === this.selectData[i].data[j].url).name
            this.active = to.path;
          }
        }
      }
      /** 给历史路由数组更新数据 */
      this.historyActive.unshift(this.editableTabsValue);
      this.historyActive = [...new Set(this.historyActive)];
    }
  },
  mounted() {
    this.isCollapse = true
    localStorage.language = localStorage.getItem('language') || 'zh'
    if(localStorage.language === 'zh'){
      this.language = '简体中文'
    }else{
      this.language = 'English'
    }
  },
  methods:{
    /** 点击Tab数据 */
    clickTab(e,index){
      if(this.$route.path!==this.editableTabs[e.index].url) this.$router.push(this.editableTabs[e.index].url)
    },
    /** 删除Tab数据 */
    removeTab(name){
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === name) {
        let historyActiveName = this.historyActive[1]
          if(!historyActiveName){
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
    /** 退出登录 */
    backLogin(){
      this.Cookie.removeCookie("token")
      this.$router.push({path:"/login",query: {redirect: this.$route.fullPath}})
    },
    /** 切换到简体中文 */
    zh(){
      this.$i18n.locale = 'zh';//改变当前语言
      localStorage.language = 'zh';
    },
    /** 切换到English */
    en(){
      this.$i18n.locale = 'en';//改变当前语言
      localStorage.language = 'en';
    },
    /** 上传图片的回调函数 */
    success(e){
      console.log(e);
      if(!/\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp)/i.test(e.file.name)) return this.$message.error('请上传正确的图片文件，且不超过500kb');
      var fm = new FormData();
      fm.append("userImg", e.file);
      Api.UploadHeader({userUid:JSON.parse(sessionStorage.getItem("userData")).userUid,fm}).then(res=>{
        console.log(res);
        switch (res.data.code){
          case 1:
            this.img = res.data.data+'?'+new Date().getTime()
            let data = JSON.parse(sessionStorage.getItem('userData'))
            data.userHeader = this.img
            sessionStorage.setItem('userData',JSON.stringify(data))
            this.centerDialogVisible = false
            this.$message({ message: res.data.message , type: "success" });
            break;
          default:
            this.$message({ message: res.data.message , type: "info" });
            break;
        }
      })
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
    /deep/ .el-dialog{min-width: 400px;}
    /deep/ .el-dialog--center .el-dialog__body{text-align: center !important;}
    /deep/ .el-upload-dragger{width:100%;height:100%;}
    #HomeRight{
        position: relative;
        .ZHEN{
          width:80px;
          height: 60px;
          box-sizing: border-box;
          position: absolute;
          right: 150px;
          display: flex;
          z-index: 2;
          border-bottom: 1px solid #E4E7ED;
          background: white;
          cursor: pointer;
          .el-dropdown{
            width:100%;
            height:100%;
            margin:auto;
            .el-dropdown-link.el-dropdown-selfdefine{
              width:100%;
              height:100%;
              display: inline-block;
              text-align: center;
              line-height: 60px;
            }
          }
        }
        /deep/ .el-avatar>img{width:100%;}
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
            width: 150px;
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
            padding-right: 230px;
            margin:0;
        }
        .name{
          display: inline-block;
          max-width: 80px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
    }
    .main{
      height: calc(100vh - 60px);
      padding: 25px 25px 10px 25px;
      box-sizing: border-box;
      overflow-x: hidden;
      .el-breadcrumb{margin-bottom: 25px;}
    }
    .fade-enter-active, .fade-leave-active {
      opacity: 1;
      transform: translate(100%,100%),rotate(90deg);
      transition: all .2s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
      transition: all .1 ;
    }
  }
</style>