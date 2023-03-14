export interface FieldLine {
  field: string;
  type: string;
  nullable: Boolean;
  unique: Boolean;
  defaultValue: string;
  comment: string;
}

export interface ClassInfo {
  className: string;
  chineseName: string;
  projectPath: string;
  packagePath: string;
}
