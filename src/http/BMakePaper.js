import axios from '@/axios'
export default{
    MakeTestPaper : data => axios.post(`/api/TestPaper/MakeTestPaper?uid=${data.uid}`,data.paper),// 制作试卷
    AddQuestionToTestPaper : data => axios.post(`/api/TestPaper/AddQuestionToTestPaper`,data), // 添加题目到试卷
}

/**
 *
{
    "tpqPaperId": 1,//试卷主键编号
    "tpqScore": 5,//分值
    "tpqQuestion": {
        "questionTitle": "下面那些是生命周期的函数", //题目的标题
        "questionTypeId": 1,//题目的类型 1=选择题 2=填空题 3=问答题
        "chooseQuestion": [
            {
            "cqOption": "push",//选项内容
            "cqIsRight": false //是否为正确答案 true:正确答案 false：不是
            },
            {
            "cqOption": "pull",
            "cqIsRight": false
            },
            {
            "cqOption": "created",
            "cqIsRight": true
            },
            {
            "cqOption": "mounted",
            "cqIsRight": true
            }
        ]
    }
}
 */