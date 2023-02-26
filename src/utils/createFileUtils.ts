import * as fs from 'fs';
import { EnumJavaType } from '../constant/javaTypeEnum'
import { ClassInfo as ClassInfo, FieldLine as FieldLine } from '../constant/classInfo'
import { generateDbClassMember, replaceCommonString, generateAddReqClassMember, generateVoClassMember } from './stringUtils';

/**
 * 检查生成的文件路径是否存在，如果不存在就创建
 * @param classInfo 类属性信息
 */
function mkdirIfNotExist(classInfo: ClassInfo): void {
    let projectPath = classInfo.projectPath
    let classNameLowerCase = classInfo.className.toLowerCase()
    const pathArr = [projectPath + "/controller",
    projectPath + "/service",
    projectPath + "/service/impl",
    projectPath + "/dao",
    projectPath + "/entity",
    projectPath + "/pojo/req/" + classNameLowerCase,
    projectPath + "/pojo/vo/" + classNameLowerCase]

    for (let one of pathArr) {
        if (!fs.existsSync(one)) {
            fs.mkdirSync(one, { recursive: true })
        }
    }
}

/**
 * 创建java文件
 * @param classInfo 类属性信息
 */
async function createJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]) {
    mkdirIfNotExist(classInfo)

    createDbJavaFile(classInfo, fieldList)
    createDaoJavaFile(classInfo)
    createControllerJavaFile(classInfo)
    createServiceJavaFile(classInfo)
    createServiceImplJavaFile(classInfo)
    createAddReqJavaFile(classInfo, fieldList)
    createEditReqJavaFile(classInfo)
    createGetPageReqJavaFile(classInfo)
    createDetailVoJavaFile(classInfo, fieldList)
    createPageVoJavaFile(classInfo, fieldList)
}

/**
 * 生成数据库实体类
 */
function createDbJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
    fs.readFile("src/template/Db.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        res = res.replace("$member_param_list$", generateDbClassMember(fieldList))
        let fullPath = classInfo.projectPath + "/entity/Db" + classInfo.className + ".java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成数据库实体类成功")
        })
    })
}

/**
 * 生成实体Dao类
 */
function createDaoJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/DbRepository.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/dao/Db" + classInfo.className + "Repository.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成实体Dao类成功")
        })
    })
}

/**
 * 生成Controller类
 */
function createControllerJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/Controller.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/controller/" + classInfo.className + "Controller.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成Controller类成功")
        })
    })
}

/**
 * 生成Service类
 */
function createServiceJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/Service.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/service/" + classInfo.className + "Service.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成Service类成功")
        })
    })
}

/**
 * 生成ServiceImpl类
 */
function createServiceImplJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/ServiceImpl.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/service/impl/" + classInfo.className + "ServiceImpl.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成ServiceImpl类成功")
        })
    })
}

/**
 * 生成AddReq类
 */
function createAddReqJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
    fs.readFile("src/template/AddReq.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        res = res.replace("$member_param_list$", generateAddReqClassMember(fieldList))
        let fullPath = classInfo.projectPath + "/pojo/req/" + classInfo.className.toLowerCase() + "/Add" + classInfo.className + "Req.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成AddReq类成功")
        })
    })
}

/**
 * 生成EditReq类
 */
function createEditReqJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/EditReq.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/pojo/req/" + classInfo.className.toLowerCase() + "/Edit" + classInfo.className + "Req.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成EditReq类成功")
        })
    })
}

/**
 * 生成GetPageReq类
 */
function createGetPageReqJavaFile(classInfo: ClassInfo): void {
    fs.readFile("src/template/GetPageReq.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        let fullPath = classInfo.projectPath + "/pojo/req/" + classInfo.className.toLowerCase() + "/Get" + classInfo.className + "PageReq.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成GetPageReq类成功")
        })
    })
}

/**
 * 生成DetailVo类
 */
function createDetailVoJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
    fs.readFile("src/template/DetailVo.txt", (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        res = res.replace("$member_param_list$", generateVoClassMember(fieldList))
        let fullPath = classInfo.projectPath + "/pojo/vo/" + classInfo.className.toLowerCase() + "/" + classInfo.className + "DetailVo.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成DetailVo类成功")
        })
    })
}

/**
 * 生成PageVo类
 */
function createPageVoJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
    fs.readFile("src/template/PageVo.txt", async (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        let res = replaceCommonString(data.toString(), classInfo)
        res = res.replace("$member_param_list$", generateVoClassMember(fieldList))
        let fullPath = classInfo.projectPath + "/pojo/vo/" + classInfo.className.toLowerCase() + "/" + classInfo.className + "PageVo.java"
        fs.writeFile(fullPath, res, "utf-8", (err) => {
            !!err ? console.log(err) : console.log("生成PageVo类成功")
        })
    })
}


let fieldList: FieldLine[] = [
    {
        field: "id",
        type: EnumJavaType.Long,
        nullable: false,
        defaultValue: "",
        comment: "id"
    },
    {
        field: "name",
        type: EnumJavaType.String,
        nullable: false,
        defaultValue: "",
        comment: "名称"
    }, {
        field: "age",
        type: EnumJavaType.Integer,
        nullable: true,
        defaultValue: "22",
        comment: "年龄"
    }, {
        field: "sex",
        type: EnumJavaType.String,
        nullable: true,
        defaultValue: "",
        comment: "性别"
    }, {
        field: "phone",
        type: EnumJavaType.String,
        nullable: false,
        defaultValue: "13344445555",
        comment: "手机号"
    }]

let classInfo: ClassInfo = {
    className: "User",
    chineseName: "用户",
    projectPath: "C:/Users/10480/Desktop/workSpace/code-generator/artifact",
    packagePath: "com.cn.wavetop.mobilegov"
}

createJavaFile(classInfo, fieldList)

export { createJavaFile }