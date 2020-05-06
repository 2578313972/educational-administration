let startTime = 0
async function save(){
    let newTime = new Date().getTime()
    if (newTime - startTime > 1000) {
        startTime = newTime
        return await new Promise((res,rej)=>{

        })
    }
}

export default save