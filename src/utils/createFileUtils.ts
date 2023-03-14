const fs = require("fs");
const isDev = process.env.IS_DEV === "true";
const templatePath = `${
  isDev ? "src/template" : "resources/app.asar.unpacked/src/template"
}`;
import { ClassInfo, FieldLine } from "../constant/classInfo";
import {
  generateDbClassMember,
  replaceCommonString,
  generateAddReqClassMember,
  generateVoClassMember,
} from "./stringUtils";
import { generateResult } from "../constant/resultInfo";

const memberParamList: string = "$member_param_list$";
const db: string = "db";
const addReq: string = "addReq";
const editReq: string = "editReq";
const getPageReq: string = "getPageReq";
const detailVo: string = "detailVo";
const pageVo: string = "pageVo";
const dao: string = "dao";
const service: string = "service";
const serviceImpl: string = "serviceImpl";
const controller: string = "controller";


const paramList: string[] = [
  db,
  addReq,
  editReq,
  getPageReq,
  detailVo,
  pageVo,
  dao,
  service,
  serviceImpl,
  controller,
];
interface funcparam {
  name: string;
  readFilePath: string;
  writeFilePath: (classInfo: ClassInfo) => string;
  replaceString: string;
  replacefunc: (fieldList: FieldLine[]) => string;
}

/**
 * 检查生成的文件路径是否存在，如果不存在就创建
 * @param classInfo 类属性信息
 */
function mkdirIfNotExist(classInfo: ClassInfo): void {
  let projectPath = classInfo.projectPath;
  let classNameLowerCase = classInfo.className.toLowerCase();
  const pathArr = [
    `projectPath/${controller}`,
    projectPath + "/service",
    projectPath + "/service/impl",
    projectPath + "/dao",
    projectPath + "/entity",
    projectPath + "/pojo/" + classNameLowerCase,
  ];

  for (let one of pathArr) {
    if (!fs.existsSync(one)) {
      fs.mkdirSync(one, { recursive: true });
    }
  }
}

function convertParam(type: string): funcparam {
  switch (type) {
    case "db":
      return {
        name: "createDbJavaFile",
        readFilePath: `${templatePath}/Db.txt`,
        // writeFilePath: classInfo.projectPath + "/entity/Db" + classInfo.className + ".java",
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/entity/Db${classInfo.className}.java`;
        },
        replaceString: memberParamList,
        replacefunc: generateDbClassMember,
      };
    case "addReq":
      return {
        name: "createAddReqJavaFile",
        readFilePath: `${templatePath}/AddReq.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath
            }/pojo/${classInfo.className.toLowerCase()}/Add${classInfo.className
            }Req.java`;
        },
        replaceString: memberParamList,
        replacefunc: generateAddReqClassMember,
      };
    case "editReq":
      return {
        name: "createEditReqJavaFile",
        readFilePath: `${templatePath}/EditReq.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath
            }/pojo/${classInfo.className.toLowerCase()}/Edit${classInfo.className
            }Req.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case "getPageReq":
      return {
        name: "createGetPageReqJavaFile",
        readFilePath: `${templatePath}/GetPageReq.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath
            }/pojo/${classInfo.className.toLowerCase()}/Get${classInfo.className
            }PageReq.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case "detailVo":
      return {
        name: "createDetailVoJavaFile",
        readFilePath: `${templatePath}/DetailVo.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath
            }/pojo/${classInfo.className.toLowerCase()}/Get${classInfo.className
            }DetailVo.java`;
        },
        replaceString: memberParamList,
        replacefunc: generateVoClassMember,
      };
    case "pageVo":
      return {
        name: "createPageVoJavaFile",
        readFilePath: `${templatePath}/PageVo.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath
            }/pojo/${classInfo.className.toLowerCase()}/Get${classInfo.className
            }PageVo.java`;
        },
        replaceString: memberParamList,
        replacefunc: generateVoClassMember,
      };
    case "dao":
      return {
        name: "createDaoJavaFile",
        readFilePath: `${templatePath}/DbRepository.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/dao/${classInfo.className}Repository.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case "service":
      return {
        name: "createServiceJavaFile",
        readFilePath: `${templatePath}/Service.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/service/${classInfo.className}Service.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case "serviceImpl":
      return {
        name: "createServiceImplJavaFile",
        readFilePath: `${templatePath}/ServiceImpl.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/service/impl/${classInfo.className}ServiceImpl.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case "controller":
      return {
        name: "createControllerJavaFile",
        readFilePath: `${templatePath}/Controller.txt`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/controller/${classInfo.className}Controller.java`;
        },
        replaceString: "",
        replacefunc: () => "",
      };

    default:
      let res: funcparam = {
        name: "",
        readFilePath: "",
        writeFilePath: () => "",
        replaceString: "",
        replacefunc: (fieldList: FieldLine[]) => {
          return "";
        },
      };
      return res;
  }
}

function createFile(
  param: funcparam,
  fieldList: FieldLine[],
  classInfo: ClassInfo
): Promise<string> {
  fs.readFile(param.readFilePath, (err, data) => {
    if (err) {
      return Promise.reject(`读取${param.name}文件失败`);
    }

    let res = replaceCommonString(data.toString(), classInfo);

    if (param.replaceString != "" && param.replacefunc(fieldList) != "") {
      res = res.replace(`${param.replaceString}`, param.replacefunc(fieldList));
    }

    fs.writeFile(param.writeFilePath(classInfo), res, "utf-8", (err) => {
      if (err) {
        return Promise.reject(`写入${param.name}文件失败`);
      }
    });
  });
  return Promise.resolve(`写入${param.name}文件成功`);
}

/* 创建java文件
 * @param classInfo 类属性信息
 */
async function createJavaFile(
  classInfo: ClassInfo,
  fieldList: FieldLine[]
): Promise<generateResult> {
  mkdirIfNotExist(classInfo);

  const responseResult = await Promise.all(
    paramList.map((one) => createFile(convertParam(one), fieldList, classInfo))
  );

  const resultInfo: generateResult = {
    code: true,
    success: [],
    failure: [],
  };

  for (let one of responseResult) {
    if (one.includes("失败")) {
      resultInfo.failure.push(one);
      resultInfo.code = false;
    } else {
      resultInfo.success.push(one);
    }
  }

  return new Promise((resolve) => {
    resolve(resultInfo);
  });
  // createDbJavaFile(classInfo, fieldList);
  // createDaoJavaFile(classInfo);
  // createControllerJavaFile(classInfo);
  // createServiceJavaFile(classInfo);
  // createServiceImplJavaFile(classInfo);
  // createAddReqJavaFile(classInfo, fieldList);
  // createEditReqJavaFile(classInfo);
  // createGetPageReqJavaFile(classInfo);
  // createDetailVoJavaFile(classInfo, fieldList);
  // createPageVoJavaFile(classInfo, fieldList);
}

// /**
//  * 生成数据库实体类
//  */
// function createDbJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
//   fs.readFile`"${templatePath}/Db.txt", (err, data) =>`{
//     if (err) {
//       throw new Error("读取实体模板失败");
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     res = res.replace(memberParamList, generateDbClassMember(fieldList));
//     let fullPath =
//       classInfo.projectPath + "/entity/Db" + classInfo.className + ".java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成数据库实体类成功");
//     });
//   });
// }

// /**
//  * 生成实体Dao类
//  */
// function createDaoJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/DbRepository.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/dao/Db" +
//       classInfo.className +
//       "Repository.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成实体Dao类成功");
//     });
//   });
// }

// /**
//  * 生成Controller类
//  */
// function createControllerJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/Controller.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/controller/" +
//       classInfo.className +
//       "Controller.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成Controller类成功");
//     });
//   });
// }

// /**
//  * 生成Service类
//  */
// function createServiceJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/Service.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/service/" +
//       classInfo.className +
//       "Service.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成Service类成功");
//     });
//   });
// }

// /**
//  * 生成ServiceImpl类
//  */
// function createServiceImplJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/ServiceImpl.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/service/impl/" +
//       classInfo.className +
//       "ServiceImpl.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成ServiceImpl类成功");
//     });
//   });
// }

// /**
//  * 生成AddReq类
//  */
// function createAddReqJavaFile(
//   classInfo: ClassInfo,
//   fieldList: FieldLine[]
// ): void {
//   fs.readFile`"${templatePath}/AddReq.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     res = res.replace(
//       memberParamList,
//       generateAddReqClassMember(fieldList)
//     );
//     let fullPath =
//       classInfo.projectPath +
//       "/pojo/req/" +
//       classInfo.className.toLowerCase() +
//       "/Add" +
//       classInfo.className +
//       "Req.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成AddReq类成功");
//     });
//   });
// }

// /**
//  * 生成EditReq类
//  */
// function createEditReqJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/EditReq.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/pojo/req/" +
//       classInfo.className.toLowerCase() +
//       "/Edit" +
//       classInfo.className +
//       "Req.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成EditReq类成功");
//     });
//   });
// }

// /**
//  * 生成GetPageReq类
//  */
// function createGetPageReqJavaFile(classInfo: ClassInfo): void {
//   fs.readFile`"${templatePath}/GetPageReq.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     let fullPath =
//       classInfo.projectPath +
//       "/pojo/req/" +
//       classInfo.className.toLowerCase() +
//       "/Get" +
//       classInfo.className +
//       "PageReq.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成GetPageReq类成功");
//     });
//   });
// }

// /**
//  * 生成DetailVo类
//  */
// function createDetailVoJavaFile(
//   classInfo: ClassInfo,
//   fieldList: FieldLine[]
// ): void {
//   fs.readFile`"${templatePath}/DetailVo.txt", (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     res = res.replace(memberParamList, generateVoClassMember(fieldList));
//     let fullPath =
//       classInfo.projectPath +
//       "/pojo/vo/" +
//       classInfo.className.toLowerCase() +
//       "/" +
//       classInfo.className +
//       "DetailVo.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成DetailVo类成功");
//     });
//   });
// }

// /**
//  * 生成PageVo类
//  */
// function createPageVoJavaFile(
//   classInfo: ClassInfo,
//   fieldList: FieldLine[]
// ): void {
//   fs.readFile`"${templatePath}/PageVo.txt", async (err, data) =>`{
//     if (err) {
//       console.log(err);
//       return;
//     }

//     let res = replaceCommonString(data.toString(), classInfo);
//     res = res.replace(memberParamList, generateVoClassMember(fieldList));
//     let fullPath =
//       classInfo.projectPath +
//       "/pojo/vo/" +
//       classInfo.className.toLowerCase() +
//       "/" +
//       classInfo.className +
//       "PageVo.java";
//     fs.writeFile(fullPath, res, "utf-8", (err) => {
//       !!err ? console.log(err) : console.log("生成PageVo类成功");
//     });
//   });
// }

export { createJavaFile };
