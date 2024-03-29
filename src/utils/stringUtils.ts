import { ClassInfo, FieldLine } from '../constant/classInfo'
/**
 * 匹配并替换通用的关键字
 * @param data 文件文本数据
 * @param classInfo 类属性信息
 * @returns 替换后的文本数据
 */
export function replaceCommonString(data: string, classInfo: ClassInfo): string {
    let res = data.replace(/\$class_name\$/g, classInfo.className)
    res = res.replace(/\$class_name_lower_case\$/g, classInfo.className.toLowerCase())
    res = res.replace(/\$chinese_name\$/g, classInfo.chineseName)
    res = res.replace(/\$package_path\$/g, classInfo.packagePath)

    return res
}

/**
 * 生成实体类的成员和注释注解
 * @param fieldList 字段信息列表
 * @returns 
 */
export function generateDbClassMember(fieldList: FieldLine[]): string {
    let str: string = ""
    let i: number = 0
    for (let one of fieldList) {
        if (i == 0) {
            str += generateComment(one.comment)
            str += generateId(one.type, one.field)
            str += lineFeed();
        } else {
            str += generateComment(one.comment)
            str += generateDbConstraint(one.nullable, one.unique)
            str += generateField(one.type, one.field, one.defaultValue)
            str += lineFeed();
        }
        i++
    }
    return str;
}

/**
 * 生成新增请求类的成员和注释注解
 * @param fieldList 字段信息列表
 * @returns 
 */
export function generateAddReqClassMember(fieldList: FieldLine[]): string {
    let str: string = ""
    let i: number = 0
    for (let one of fieldList) {
        if (i == 0) {
            i++
            continue
        } else {
            str += generateComment(one.comment)
            str += generateReqSwagger(one.comment, one.type, one.nullable)
            str += generateValidation(one.type, one.comment, one.nullable)
            str += generateField(one.type, one.field, one.defaultValue)
            str += lineFeed();
        }
        i++
    }

    return str;
}

export function generateVoClassMember(fieldList: FieldLine[]): string {
    let str: string = ""
    let i: number = 0
    for (let one of fieldList) {
        if (i == 0) {
            str += generateComment(one.comment)
            str += generateVoSwagger(one.comment)
            str += "    private " + one.type + " " + one.field + ";\n"
            str += lineFeed();
        } else {
            str += generateComment(one.comment)
            str += generateVoSwagger(one.comment)
            str += generateField(one.type, one.field, one.defaultValue)
            str += lineFeed();
        }
        i++
    }

    return str;
}




function lineFeed(): string {
    return "\n"
}

function generateComment(comment: string): string {
    let str: string = ""
    str += "    /**\n"
    str += "     * " + comment + "\n"
    str += "     */\n"

    return str
}

function generateId(type: string, field: string): string {
    let str: string = ""
    str += "    @Id\n"
    str += "    @GeneratedValue(strategy = GenerationType.IDENTITY)\n"
    str += "    private " + type + " " + field + ";\n"

    return str
}

function generateDbConstraint(nullable: Boolean, unique: Boolean): string {
    // @Column(nullable = false, unique = true)
    return "    @Column(nullable = " + nullable + ", unique = " + unique + ")\n"
}

function generateField(type: string, field: string, defaultValue: string): string {
    // private Long Id;
    let str: string = "    private " + type + " " + field
    str += generateDefaultValue(type, defaultValue)

    return str;
}

function generateDefaultValue(type: string, defaultValue: string): string {
    let str: string = ""
    if (!defaultValue || defaultValue == "") {
        return str += ";\n"
    }
    str += " = "
    if ("String" == type) {
        str += "\"" + defaultValue + "\""
    } else if ("Long" == type) {
        str += "\"" + defaultValue + "L\""
    } else {
        str += defaultValue
    }

    return str += ";\n"
}

function generateReqSwagger(comment: string, type: string, nullable: Boolean): string {
    // @ApiModelProperty(value = "test", required = true, example = "true")
    let str: string = "    @ApiModelProperty(value = \""
    str += comment
    str += "\", required = "
    str += nullable ? "false" : "true"
    str += ", example = "
    switch (type) {
        case "Boolean": {
            str += "\"true\""
            break
        }
        case "Date": {
            str += "\"2023-01-01 10:10:10\""
            break
        }
        case "Integer": {
            str += "\"1\""
            break
        }
        case "Long": {
            str += "\"1\""
            break
        }
        case "String": {
            str += "\"string\""
            break
        }

    }

    return str += ")\n"
}

// todo 根据类型决定导入的包
function generateValidation(type: string, comment: string, nullable: Boolean): string {
    let str = ""
    if (nullable) {
        return str
    }
    if (type == "String") {
        str += "    @NotBlank(message = \"" + comment + "不能为空\")\n"
    } else {
        str += "    @NotNull(message = \"" + comment + "不能为空\")\n"
    }

    return str
}

function generateVoSwagger(comment: string): string {
    return "    @ApiModelProperty(value = \"" + comment + "\")\n"
}