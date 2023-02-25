import {EnumJavaType} from "./javaTypeEnum"

export interface FieldLine {
    filed: string;
    type: EnumJavaType;
    nullable: Boolean;
    default: string;
    comment: string
}

export interface ClassInfo {
    className: string;
    chineseName: string;
    projectPath: string;
    packagePath: string
}