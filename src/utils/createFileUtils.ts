const fs = require("fs");
const isDev = process.env.IS_DEV === "true";
const templatePath = `${isDev ? "src/template" : "resources/app.asar.unpacked/src/template"}`;
import { ClassInfo, FieldLine } from "../constant/classInfo";
import { generateDbClassMember, replaceCommonString, generateAddReqClassMember, generateVoClassMember } from "./stringUtils";
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
const entity: string = "entity";
const pojo: string = "pojo";
const dotTxt: string = ".txt";
const dotJava: string = ".java";

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
  controller
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
  const pathArr = [
    `${classInfo.projectPath}/${controller}`,
    `${classInfo.projectPath}/${service}`,
    `${classInfo.projectPath}/${service}/impl`,
    `${classInfo.projectPath}/${dao}`,
    `${classInfo.projectPath}/${entity}`,
    `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}`,
  ];

  for (let one of pathArr) {
    if (!fs.existsSync(one)) {
      fs.mkdirSync(one, { recursive: true });
    }
  }
}

/**
 * 根据类型获取生成文件的参数
 */
function convertParam(type: string): funcparam {
  switch (type) {
    case db:
      return {
        name: "数据库实体类",
        readFilePath: `${templatePath}/Db${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${entity}/Db${classInfo.className}${dotJava}`;
        },
        replaceString: memberParamList,
        replacefunc: generateDbClassMember,
      };
    case addReq:
      return {
        name: "AddReq类",
        readFilePath: `${templatePath}/AddReq${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}/Add${classInfo.className}Req${dotJava}`;
        },
        replaceString: memberParamList,
        replacefunc: generateAddReqClassMember,
      };
    case editReq:
      return {
        name: "EditReq类",
        readFilePath: `${templatePath}/EditReq${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}/Edit${classInfo.className}Req${dotJava}`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case getPageReq:
      return {
        name: "GetPageReq类",
        readFilePath: `${templatePath}/GetPageReq${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}/Get${classInfo.className}PageReq${dotJava}`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case detailVo:
      return {
        name: "DetailVo类",
        readFilePath: `${templatePath}/DetailVo${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}/Get${classInfo.className}DetailVo${dotJava}`;
        },
        replaceString: memberParamList,
        replacefunc: generateVoClassMember,
      };
    case pageVo:
      return {
        name: "PageVo类",
        readFilePath: `${templatePath}/PageVo${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${pojo}/${classInfo.className.toLowerCase()}/Get${classInfo.className}PageVo${dotJava}`;
        },
        replaceString: memberParamList,
        replacefunc: generateVoClassMember,
      };
    case dao:
      return {
        name: "Dao类",
        readFilePath: `${templatePath}/DbRepository${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${dao}/${classInfo.className}Repository${dotJava}`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case service:
      return {
        name: "Service类",
        readFilePath: `${templatePath}/Service${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${service}/${classInfo.className}Service${dotJava}`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case serviceImpl:
      return {
        name: "ServiceImpl类",
        readFilePath: `${templatePath}/ServiceImpl${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${service}/impl/${classInfo.className}ServiceImpl${dotJava}`;
        },
        replaceString: "",
        replacefunc: () => "",
      };
    case controller:
      return {
        name: "Controller类",
        readFilePath: `${templatePath}/Controller${dotTxt}`,
        writeFilePath: (classInfo: ClassInfo) => {
          return `${classInfo.projectPath}/${controller}/${classInfo.className}Controller${dotJava}`;
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

function createFile(param: funcparam, fieldList: FieldLine[], classInfo: ClassInfo): Promise<string> {
  return new Promise<string>((resolve) => {
    fs.readFile(param.readFilePath, (err, data) => {
      if (err) {
        resolve(`读取${param.name}文件失败`);
        return;
      }

      let res = replaceCommonString(data.toString(), classInfo);

      if (param.replaceString != "" && param.replacefunc(fieldList) != "") {
        res = res.replace(`${param.replaceString}`, param.replacefunc(fieldList));
      }

      fs.writeFile(param.writeFilePath(classInfo), res, "utf-8", (err) => {
        if (err) {
          resolve(`写入${param.name}文件失败`);
        } else {
          resolve(`写入${param.name}文件成功`);
        }
      });
    });
  });
}

/* 创建java文件
 * @param classInfo 类属性信息
 */
async function mkdirAndCreateAllFile(classInfo: ClassInfo, fieldList: FieldLine[]): Promise<generateResult> {
  mkdirIfNotExist(classInfo);

  const responseResult = await Promise.all(paramList.map((one) => createFile(convertParam(one), fieldList, classInfo)));

  const resultInfo: generateResult = {
    success: [],
    failure: [],
  };

  for (let one of responseResult) {
    if (one.includes("失败")) {
      resultInfo.failure.push(one);
    } else {
      resultInfo.success.push(one);
    }
  }

  return new Promise((resolve) => {
    resolve(resultInfo);
  });
}

export { mkdirAndCreateAllFile as mkdirAndCreateAllFile };
