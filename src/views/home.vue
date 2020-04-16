<template>
  <div class="home">
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'" style="transition:.2s" >
        <HomeLeft 
        :active="active"
        :isCollapse="isCollapse"
        :selectData="selectData" 
        @select="select"
      />
      </el-aside>
      <el-main>
        <HomeRight 
        :editableTabs="editableTabs" 
        :value="value"
        :isCollapse='isCollapse'
        @clickTab="clickTab"
        @change="change"
        @removeTab="removeTab"
      />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HomeLeft from './compontents/HomeLeft'
import HomeRight from './compontents/HomeRight'
export default {
  data(){
    return{
      active:'',
      isCollapse:false,
      selectData:[
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
      editableTabs: [
        {title: '首页', name: '1',url:'/'}
      ],
      tabIndex: 1,
      value:"1"
    }
  },
  methods:{
    change(){
      console.log(123123)
      this.isCollapse = !this.isCollapse
    },
    select(url,e){
      this.selectData[e[0]].data.forEach((element,index) => {
        if(element.url===url){
          let data = this.selectData[e[0]].data[index]
          for (const key in this.editableTabs) {
            if (this.editableTabs[key].title === data.name) return this.editableTabsValue = this.editableTabs[key].name
          }
          this.editableTabs.push({title: data.name, name: ++this.tabIndex+"",url:data.url,bool:true})
          this.value = this.tabIndex.toString()
        }
      });
    },
    clickTab(e,index){
      if(this.$route.path!==this.editableTabs[e].url) this.$router.push(this.editableTabs[e].url)
      this.active = this.editableTabs[e].url
      this.value = index
    },
    removeTab(name){
      let tabs = this.editableTabs;
      let activeName = this.value;
      console.log(activeName)
      if (activeName === name) {
          tabs.forEach((tab, index) => {
              if (tab.name === name) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                      this.value = nextTab.name;
                      this.$router.push(nextTab.url)
                  }
              }
          });
      }
      this.editableTabs = tabs.filter(tab => tab.name !== name);
    }
  },
  components:{
    HomeLeft,
    HomeRight
  }
}
</script>

<style lang="less">
  .el-main{padding:0;}
</style>
