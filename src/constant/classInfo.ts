import {EnumJavaType} from './javaTypeEnum'

export interface FieldLine {
    field: string;
    type: EnumJavaType;
    nullable: Boolean;
    defaultValue: string;
    comment: string
}

export interface ClassInfo {
    className: string;
    chineseName: string;
    projectPath: string;
    packagePath: string
}