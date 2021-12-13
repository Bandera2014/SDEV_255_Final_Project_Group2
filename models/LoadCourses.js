const Course = require("./Course")

async function createCourse(){
    const course255 = await Course.create({
        name:"SDEV255",
        description:"Web Apps"
    })
    await course.save()

    console.log(course)
    const course140 = await Course.create({
        name:"SDEV140",
        description:"Intro to Software Development"
    })
    await course.save()

    console.log(course)
    const course264 = await Course.create({
        name:"SDEV264",
        description:"Mobile Application"
    })
    await course.save()
    console.log(course)
}

module.exports = mongoose.model('Course', courseSchema)