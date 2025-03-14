import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  message,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import * as Yup from "yup";
import { Formik } from "formik";
import moment from "moment";
import getFinancialRecords from "../services/getFinancialRecords";
import createFinancialRecord from "../services/createFinancialRecord";
import updateFinancialRecord from "../services/updateFinancialRecord";
import generateFinancialReport from "../services/getFinancialReport";
import FinancialCharts from "./FinancialCharts";
import deleteFinancialRecord from "../services/deleteFinancialRecord";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  type: Yup.string().oneOf(["Revenue", "Expense"]).required("Type is required"),
  amount: Yup.number()
    .min(0, "Amount must be non-negative")
    .required("Amount is required"),
  date: Yup.date().required("Date is required"),
  description: Yup.string().max(200, "Description too long"),
});

const FinancialManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [financialReport, setFinancialReport] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getFinancialRecords();
      setRecords(data);
      const report = await generateFinancialReport();
      setFinancialReport(report);
    } catch (error) {
      message.error("Error fetching financial data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = () => {
    setEditRecord(null);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: `Type: ${record.type}, Amount: $${record.amount?.toFixed(2)}`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteFinancialRecord(record._id);
          message.success("Record deleted successfully");
          fetchRecords();
        } catch (error) {
          message.error("Failed to delete record");
        }
      },
    });
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (editRecord) {
        await updateFinancialRecord(editRecord._id, values);
        message.success("Financial record updated successfully.");
      } else {
        await createFinancialRecord(values);
        message.success("Financial record added successfully.");
      }
      setModalVisible(false);
      fetchRecords();
    } catch (error) {
      message.error("Error saving financial record.");
    }
    setSubmitting(false);
  };

  const columns = [
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Amount ($)",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `$${text?.toFixed(2) || "0.00"}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const chartData = records.map((record) => ({
    date: moment(record.date).format("YYYY-MM-DD"),
    revenue: record.type === "Revenue" ? record.amount : 0,
    expense: record.type === "Expense" ? record.amount : 0,
  }));

  const revenueExpenseSummary = [
    { name: "Revenue", value: financialReport?.totalRevenue || 0 },
    { name: "Expenses", value: financialReport?.totalExpenses || 0 },
  ];

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Financial Management</h2>

      {!loading && (
        <div className="bg-white shadow rounded-xl p-5 mb-6">
          <FinancialCharts
            chartData={chartData}
            revenueExpenseSummary={revenueExpenseSummary}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <Button type="primary" onClick={handleAdd}>
          Add Financial Record
        </Button>
        {financialReport && (
          <div className="text-right font-medium">
            <p>
              Total Revenue:{" "}
              <span className="text-green-600">
                ${financialReport.totalRevenue?.toFixed(2)}
              </span>
            </p>
            <p>
              Total Expenses:{" "}
              <span className="text-red-600">
                ${financialReport.totalExpenses?.toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={records}
        loading={loading}
        rowKey="_id"
        bordered
      />

      {/* Modal */}
      <Modal
        title={editRecord ? "Edit Financial Record" : "Add Financial Record"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Formik
          enableReinitialize
          initialValues={{
            type: editRecord?.type || "Revenue",
            amount: editRecord?.amount || "",
            date: editRecord ? moment(editRecord.date) : moment(),
            description: editRecord?.description || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            errors,
            touched,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Type"
                validateStatus={touched.type && errors.type ? "error" : ""}
                help={touched.type && errors.type}
              >
                <Select
                  value={values.type}
                  onChange={(value) => setFieldValue("type", value)}
                >
                  <Option value="Revenue">Revenue</Option>
                  <Option value="Expense">Expense</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Amount ($)"
                validateStatus={touched.amount && errors.amount ? "error" : ""}
                help={touched.amount && errors.amount}
              >
                <Input
                  type="number"
                  value={values.amount}
                  onChange={(e) => setFieldValue("amount", e.target.value)}
                  placeholder="Enter amount"
                />
              </Form.Item>

              <Form.Item
                label="Date"
                validateStatus={touched.date && errors.date ? "error" : ""}
                help={touched.date && errors.date}
              >
                <DatePicker
                  value={moment(values.date)}
                  onChange={(date) => setFieldValue("date", date)}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                validateStatus={
                  touched.description && errors.description ? "error" : ""
                }
                help={touched.description && errors.description}
              >
                <Input.TextArea
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  rows={3}
                  placeholder="Optional description"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isSubmitting}
              >
                {editRecord ? "Update" : "Add"} Record
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default FinancialManagement;
