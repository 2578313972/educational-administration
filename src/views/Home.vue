<template>
  <div id="Home">
    <el-container>
      <el-aside width="auto" >
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
          :style="{height:height-70+'px'}"
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
            <div class="account_1">

              
              <el-row class="block-col-2">
                <el-col :span="12">
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <i class="el-icon-s-custom"></i>退出
                      <div class="account_2"><i class="el-icon-s-custom"></i></div>
                    </span>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item icon="el-icon-plus">退出52525252</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </div>
            <!-- <div class="account_2"><i class="el-icon-s-custom"></i></div> -->
          </div>

          <el-tabs v-model="editableTabsValue" type="card" @tab-click="clickTab" @tab-remove="removeTab">
            <el-tab-pane
              v-for="item in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="item.title==='首页'?false:true"
            >
              <router-view />
            </el-tab-pane>
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
      height:0, // 定义左边菜单栏高度
      active:'', // 左侧菜单栏选中目标
      isCollapse:false, // 缩展
      selectData:[ // 菜单栏选择数据
        {name:"基础数据",data:[
          {url:"/FClass",name:"班级管理"},
          {url:"/FStudent",name:"学生管理"},
          {url:"/FTeacher",name:"老师管理"},
          {url:"/FPassword",name:"修改密码"}
        ]},{name:"在线测试",data:[
          {url:"/BTeacher",name:"老师出卷"},
          {url:"/BPaper",name:"试卷管理"},
          {url:"/BArrange",name:"安排测试"},
          {url:"/BReadover",name:"批阅试卷"},
          {url:"/BTest",name:"测试成绩"}
        ]}
      ],
      editableTabs: [ // Tab页数据
        {title: '首页', name: '1',url:'/'}
      ],
      tabIndex: 1,
      editableTabsValue:"1" // 默认显示（Tab标签）
    }
  },
  created() {
      this.height = window.innerHeight; // 获取屏幕高度给左菜单栏

      this.active = this.$route.fullPath; // 改变左菜单栏目标
      for (let i in this.selectData) { // 循环遍历相同的路由并创建tab切换页
        for (let j in this.selectData[i].data) {
          if(this.selectData[i].data[j].url === this.$route.fullPath){
            this.editableTabs.push({title:this.selectData[i].data[j].name,name:++this.tabIndex+"",url:this.$route.fullPath})
            this.editableTabsValue = this.tabIndex+""

          }
        }
      }

  },
  methods:{
    select(url,e){ // 点击添加Tab数据
      this.selectData[e[0]].data.forEach((element,index) => {
        if(element.url===url){
          let data = this.selectData[e[0]].data[index]
          for (const key in this.editableTabs) {
            if (this.editableTabs[key].title === data.name) return this.editableTabsValue = this.editableTabs[key].name
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
          tabs.forEach((tab, index) => {
              if (tab.name === name) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                      this.active = nextTab.url
                      this.editableTabsValue = nextTab.name;
                      this.$router.push(nextTab.url)
                  }
              }
          });
      }
      this.editableTabs = tabs.filter(tab => tab.name !== name);
    }
  }
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
        .el-menu-vertical-demo.top-el-menu{height: 70px;}
        .el-menu-vertical-demo.top-el-menu .el-menu-item.tl-item{background-color: rgb(255, 235, 58) !important;line-height: 70px;font-weight: 600;font-size: 19px;}
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
            line-height: 70px;
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
            line-height: 70px;
            box-sizing: border-box;
            cursor: pointer;
            position: absolute;
            z-index: 2;
            font-size: 30px;
            right: 0px;
            display: flex;
            justify-content: center;
            top: 0px;
            .account_1{
              color: #5D636A;
              .el-col.el-col-12{
                padding-top: 5px;
                width:120px;
                line-height: 65px;
                .el-dropdown{
                  width:100%;
                  font-size: 16px;
                  font-weight: 500;
                  i{margin-right: 5px;font-size: 18px;}
                  .account_2{
                    i{margin-right: 0px;font-size: 28px;}
                    display: inline-block;
                    width: 45px;
                    height:45px;
                    line-height: 40px;
                    font-size: 28px;
                    margin: auto 0px;
                    text-align: center;
                    border-radius: 50%;
                    color: white;
                    background-color: #C2C6CE;
                  }
                }
                
              }
            }
        }
        .el-tabs.el-tabs--card.el-tabs--top{
            padding-top: 29px;
        }
        /deep/ .el-tabs__header.is-top{
            width: 100%;
            min-width: 300px;
            box-sizing: border-box;
            padding-left: 50px;
            padding-right: 120px;
        }
    }
  }
</style>
