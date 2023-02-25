import { Button, Popconfirm, Form, Input, Table, Typography } from "antd";
import { nanoid } from "nanoid";
import React, { Component } from "react";
import styles from "./index.module.scss";
export default class Content extends Component {
  state = {
    editingKey: "",
    tableData: [
      {
        key: nanoid(),
        filed: "",
        type: "",
        nullable: "",
        default: "",
        comment: "",
      },
    ],
  };
  isEditing = (record) => record.key === this.state.editingKey;
  edit = (record) => {
    this.form.setFieldsValue({
      filed: "",
      type: "",
      nullable: "",
      default: "",
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
      const row = await this.form.validateFields();
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
      dataIndex: "filed",
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
    },
    {
      title: "默认值",
      dataIndex: "default",
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
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
                message: `Please Input ${title}!`,
              },
            ]}
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
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: this.isEditing(record),
      }),
    };
  });
  onFinish = (values) => {
    console.log(values);
  };
  onValuesChange = (changedValues, allValues) => {
    console.log(allValues);
  };
  getValue = () => {
    console.log(this.form.getFieldsValue());
  };
  render() {
    return (
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.inputcontainer}>
            <Form
              layout="inline"
              onFinish={this.onFinish}
              onValuesChange={this.onValuesChange}
            >
              <Form.Item label="英文类名" name="englishClassName">
                <Input></Input>
              </Form.Item>
              <Form.Item label="中文类名" name="chineseClassName">
                <Input></Input>
              </Form.Item>
              <Form.Item label="项目路径" name="projectPath">
                <Input></Input>
              </Form.Item>
              <Form.Item label="包名" name="packageName">
                <Input></Input>
              </Form.Item>
              {/* <Form.Item>
                
              </Form.Item> */}
            </Form>
          </div>
          <Form
            component={false}
            ref={(c) => {
              this.form = c;
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
            ></Table>
          </Form>

          {/* <Button onClick={this.getValue}>测试</Button> */}
        </div>
      </div>
    );
  }
}
