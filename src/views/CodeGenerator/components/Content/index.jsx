import {
  Select,
  Switch,
  Button,
  Popconfirm,
  Form,
  Input,
  Table,
  Typography,
} from "antd";
import { nanoid } from "nanoid";
import { createJavaFile } from "@/utils/createFileUtils.ts";
import React, { Component } from "react";
import styles from "./index.module.scss";
export default class Content extends Component {
  state = {
    editingKey: "",
    tableData: [
      {
        key: nanoid(),
        field: "id",
        type: "Long",
        nullable: false,
        defaultValue: "1",
        comment: "id",
      },
    ],
  };
  componentDidMount = () => {
    this.classForm.setFieldsValue({
      className: "MyClass",
      chineseName: "我的类",
      projectPath: "C:\\Users\\10480\\Desktop\\workSpace\\artifact",
      packagePath: "com.cn.cnm",
    });
  };
  addRow = () => {
    const oldData = this.state.tableData;
    oldData.push({
      key: nanoid(),
      field: "",
      type: "",
      nullable: false,
      defaultValue: "",
      comment: "",
    });
    this.setState({ tableData: JSON.parse(JSON.stringify(oldData)) });
  };
  isEditing = (record) => record.key === this.state.editingKey;
  edit = (record) => {
    this.tableForm.setFieldsValue({
      field: "",
      type: "",
      nullable: false,
      defaultValue: "",
      comment: "",
      ...record,
    });
    this.setState({ editingKey: record.key });
  };
  cancel = () => {
    this.setState({ editingKey: "" });
  };
  save = async (key) => {
    try {
      const row = await this.tableForm.validateFields();
      const newData = [...this.state.tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ tableData: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ tableData: newData, editingKey: "" });
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  columns = [
    {
      title: "类属性名",
      dataIndex: "field",
      width: "20%",
      editable: true,
    },
    {
      title: "类型",
      dataIndex: "type",
      width: "15%",
      editable: true,
    },
    {
      title: "是否为空",
      dataIndex: "nullable",
      width: "10%",
      editable: true,
      render: (_, render) => {
        const { nullable } = render;
        return <Switch defaultChecked={nullable} disabled={true} />;
      },
    },
    {
      title: "默认值",
      dataIndex: "defaultValue",
      width: "15%",
      editable: true,
    },
    {
      title: "注释",
      dataIndex: "comment",
      width: "20%",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = this.isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => this.save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={this.cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={this.state.editingKey !== ""}
            onClick={() => this.edit(record)}
          >
            编辑
          </Typography.Link>
        );
      },
    },
  ];
  EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode;
    switch (dataIndex) {
      case "type":
        inputNode = (
          <Select
            options={[
              {
                value: "Long",
                label: "Long",
              },
              {
                value: "Integer",
                label: "Integer",
              },
              {
                value: "String",
                label: "String",
              },
              {
                value: "Boolean",
                label: "Boolean",
              },
              {
                value: "Date",
                label: "Date",
              },
            ]}
          />
        );
        break;
      case "nullable":
        inputNode = <Switch defaultChecked={record.nullable} />;
        break;
      default:
        inputNode = <Input />;
        break;
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
            valuePropName={dataIndex === "nullable" ? "checked" : undefined}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  mergedColumns = this.columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => {
        return {
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        };
      },
    };
  });
  onFinish = (values) => {
    // console.log(values);
  };
  onValuesChange = (changedValues, allValues) => {
    // console.log(allValues);
  };
  generateCode = () => {
    const classInfo = this.classForm.getFieldsValue();
    const fieldList = this.state.tableData;
    console.log({
      classInfo,
      fieldList,
    });
    createJavaFile(classInfo, fieldList);
  };

  handleSaveClick = async (event) => {
    const { dialog } = require("@electron/remote");
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    this.classForm.setFieldsValue({
      projectPath: `${result.filePaths[0]}\\artifact`,
    });
  };
  render() {
    return (
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.inputcontainer}>
            <Form
              layout="inline"
              ref={(c) => {
                this.classForm = c;
              }}
              onFinish={this.onFinish}
              onValuesChange={this.onValuesChange}
            >
              <Form.Item label="英文类名" name="className">
                <Input placeholder="Class"></Input>
              </Form.Item>
              <Form.Item label="中文类名" name="chineseName">
                <Input placeholder="中文名"></Input>
              </Form.Item>
              <Form.Item label="项目路径" name="projectPath">
                <Input
                  placeholder="c://User/DeskTop"
                  onDoubleClick={this.handleSaveClick}
                ></Input>
              </Form.Item>
              {/* <Button onClick={this.handleSaveClick}>Save File</Button> */}
              <Form.Item label="包名" name="packagePath">
                <Input placeholder="com.cn.packagename"></Input>
              </Form.Item>
              {/* <Form.Item>
                
              </Form.Item> */}
            </Form>
          </div>
          <div className={styles.tablecontainer}>
            <Form
              component={false}
              ref={(c) => {
                this.tableForm = c;
              }}
            >
              <Table
                components={{
                  body: {
                    cell: this.EditableCell,
                  },
                }}
                bordered
                dataSource={this.state.tableData}
                columns={this.mergedColumns}
                rowClassName={styles.editablerow}
                pagination={false}
                scroll={{ y: "calc(100vh - 500px)" }}
              ></Table>
            </Form>
          </div>

          <Button onClick={this.addRow}>添加行</Button>
        </div>
        <div className={styles.footer}>
          <span className="title-font">生成代码</span>
          <Button type="primary" onClick={this.generateCode}>
            一键生成
          </Button>
        </div>
      </div>
    );
  }
}
