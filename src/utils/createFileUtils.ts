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

/**
 * 检查生成的文件路径是否存在，如果不存在就创建
 * @param classInfo 类属性信息
 */
function mkdirIfNotExist(classInfo: ClassInfo): void {
  let projectPath = classInfo.projectPath;
  let classNameLowerCase = classInfo.className.toLowerCase();
  const pathArr = [
    projectPath + "/controller",
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

/**
 * 创建java文件
 * @param classInfo 类属性信息
 */
function createJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]) {
  mkdirIfNotExist(classInfo);
  createDbJavaFile(classInfo, fieldList);
  createDaoJavaFile(classInfo);
  createControllerJavaFile(classInfo);
  createServiceJavaFile(classInfo);
  createServiceImplJavaFile(classInfo);
  createAddReqJavaFile(classInfo, fieldList);
  createEditReqJavaFile(classInfo);
  createGetPageReqJavaFile(classInfo);
  createDetailVoJavaFile(classInfo, fieldList);
  createPageVoJavaFile(classInfo, fieldList);
}

/**
 * 生成数据库实体类
 */
function createDbJavaFile(classInfo: ClassInfo, fieldList: FieldLine[]): void {
  fs.readFile(`${templatePath}/Db.txt`, (err, data) => {
    if (err) {
      throw new Error("读取实体模板失败");
    }

    let res = replaceCommonString(data.toString(), classInfo);
    res = res.replace("$member_param_list$", generateDbClassMember(fieldList));
    let fullPath =
      classInfo.projectPath + "/entity/Db" + classInfo.className + ".java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成数据库实体类成功");
    });
  });
}

/**
 * 生成实体Dao类
 */
function createDaoJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/DbRepository.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/dao/Db" +
      classInfo.className +
      "Repository.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成实体Dao类成功");
    });
  });
}

/**
 * 生成Controller类
 */
function createControllerJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/Controller.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/controller/" +
      classInfo.className +
      "Controller.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成Controller类成功");
    });
  });
}

/**
 * 生成Service类
 */
function createServiceJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/Service.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/service/" +
      classInfo.className +
      "Service.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成Service类成功");
    });
  });
}

/**
 * 生成ServiceImpl类
 */
function createServiceImplJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/ServiceImpl.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/service/impl/" +
      classInfo.className +
      "ServiceImpl.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成ServiceImpl类成功");
    });
  });
}

/**
 * 生成AddReq类
 */
function createAddReqJavaFile(
  classInfo: ClassInfo,
  fieldList: FieldLine[]
): void {
  fs.readFile(`${templatePath}/AddReq.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    res = res.replace(
      "$member_param_list$",
      generateAddReqClassMember(fieldList)
    );
    let fullPath =
      classInfo.projectPath +
      "/pojo/req/" +
      classInfo.className.toLowerCase() +
      "/Add" +
      classInfo.className +
      "Req.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成AddReq类成功");
    });
  });
}

/**
 * 生成EditReq类
 */
function createEditReqJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/EditReq.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/pojo/req/" +
      classInfo.className.toLowerCase() +
      "/Edit" +
      classInfo.className +
      "Req.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成EditReq类成功");
    });
  });
}

/**
 * 生成GetPageReq类
 */
function createGetPageReqJavaFile(classInfo: ClassInfo): void {
  fs.readFile(`${templatePath}/GetPageReq.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    let fullPath =
      classInfo.projectPath +
      "/pojo/req/" +
      classInfo.className.toLowerCase() +
      "/Get" +
      classInfo.className +
      "PageReq.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成GetPageReq类成功");
    });
  });
}

/**
 * 生成DetailVo类
 */
function createDetailVoJavaFile(
  classInfo: ClassInfo,
  fieldList: FieldLine[]
): void {
  fs.readFile(`${templatePath}/DetailVo.txt`, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    res = res.replace("$member_param_list$", generateVoClassMember(fieldList));
    let fullPath =
      classInfo.projectPath +
      "/pojo/vo/" +
      classInfo.className.toLowerCase() +
      "/" +
      classInfo.className +
      "DetailVo.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成DetailVo类成功");
    });
  });
}

/**
 * 生成PageVo类
 */
function createPageVoJavaFile(
  classInfo: ClassInfo,
  fieldList: FieldLine[]
): void {
  fs.readFile(`${templatePath}/PageVo.txt`, async (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let res = replaceCommonString(data.toString(), classInfo);
    res = res.replace("$member_param_list$", generateVoClassMember(fieldList));
    let fullPath =
      classInfo.projectPath +
      "/pojo/vo/" +
      classInfo.className.toLowerCase() +
      "/" +
      classInfo.className +
      "PageVo.java";
    fs.writeFile(fullPath, res, "utf-8", (err) => {
      !!err ? console.log(err) : console.log("生成PageVo类成功");
    });
  });
}

export { createJavaFile };
