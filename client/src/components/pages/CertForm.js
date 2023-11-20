import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Tabs,
  Radio,
  message,
  Spin,
} from "antd";
import { getAllUsers } from "../../api/users";
import { createCert } from "../../api/certs";
import jsPDF from "jspdf";
import {
  WATCH_BRANDS,
  WATCH_MOVEMENTS,
  WATCH_CASE_MATERIALS,
  BRACELET_STRAP_MATERIALS,
} from "../../constants";

const { TabPane } = Tabs;

// Certificate Form component
export const CertForm = ({ visible, onCancel, setRefetchCertForAdmin }) => {
  // State variables and their initial values
  const [activeTab, setActiveTab] = useState("serial");
  const [userEmails, setUserEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize the form using Form.useForm()
  const [form] = Form.useForm();

  // Effect hook to fetch user emails when the component mounts
  useEffect(() => {
    getAllUsers()
      .then((response) => {
        setUserEmails(response.emails);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user emails:", error);
        setLoading(false);
      });
  }, []);

  // Function to handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Function to handle canceling the form
  const handleCancel = () => {
    onCancel();
  };

  // Function to handle going to the next tab
  const handleNext = () => {
    // Handle the next button logic, e.g., validate and move to the next tab
    setActiveTab((current) => {
      return current === "serial" ? "watch" : "cert";
    });
  };

  // Function to handle going to the previous tab
  const handlePrevious = () => {
    // Handle the previous button logic, e.g., move back to the previous tab
    setActiveTab((current) => {
      return current === "cert" ? "watch" : "serial";
    });
  };

  // Function to handle form submission and certificate creation
  const handleFinish = async (values) => {
    // Extracting the year of production (yop) from the DatePicker component
    const yop = values.yop.$y;

    // Create a new jsPDF instance for generating a PDF certificate
    const doc = new jsPDF();
    doc.text("Certificate of Validation", 10, 10);
    doc.text("User Email: " + values.user_email, 10, 30);
    doc.text("Validated By: " + values.validated_by, 10, 40);
    doc.text("Date of Validation: " + values.date_of_validation, 10, 50);
    doc.text("Issue Date: " + values.issue_date, 10, 60);
    doc.text("Expiry Date: " + values.expiry_date, 10, 70);
    doc.text("Remarks: " + values.remarks, 10, 80);

    // Generate the PDF content as a data URI
    const pdfContent = doc.output("datauristring");

    // Construct the data object for certificate creation
    const data = { ...values, yop: yop, pdf_content: pdfContent };

    try {
      // Attempt to create the certificate using the API
      const response = await createCert(data);
      if (response.success) {
        // Show a success message if the certificate creation is successful
        message.success("Certificate created successfully");
        // Set the flag to trigger a refetch of certificates for admin
        setRefetchCertForAdmin(true);

        // Close the modal
        onCancel();
      }
    } catch (error) {
      // Show an error message if certificate creation fails
      message.error("Certificate failed to create");
    }
  };

  return (
    <Modal
      title="Certificate Form"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Serial Number Form" key="serial">
          <Form layout="vertical" onFinish={handleNext} form={form}>
            <Form.Item
              label="Case Serial Numbers"
              name="case_serial"
              rules={[
                { required: true, message: "Case serial numbers is required" },
                {
                  pattern: /^[A-Za-z0-9]{8}$/,
                  message:
                    "Case serial numbers must be 8 characters long and contain only letters and numbers.",
                },
              ]}
            >
              <Input maxLength={8} />
            </Form.Item>
            <Form.Item
              label="Movement Serial"
              name="movement_serial"
              rules={[
                {
                  required: true,
                  message: "Movement serial numbers is required",
                },
                {
                  pattern: /^[A-Za-z0-9]{10,12}$/,
                  message:
                    "Movement serial numbers must be 10-12 characters long and contain only letters and numbers.",
                },
              ]}
            >
              <Input maxLength={12} />
            </Form.Item>
            <Form.Item
              label="Dial Serial"
              name="dial"
              rules={[
                { required: true, message: "Dial serial numbers is required" },
                {
                  pattern: /^[A-Za-z0-9]{8}$/,
                  message:
                    "Dial serial numbers must be 8 characters long and contain only letters and numbers.",
                },
              ]}
            >
              <Input maxLength={8} />
            </Form.Item>
            <Form.Item
              label="Bracelet/Strap Serial"
              name="bracelet_strap"
              rules={[
                {
                  pattern: /^[A-Za-z0-9]{6,8}$/,
                  message:
                    "Bracelet or strap serial numbers must be 6-8 characters long and contain only letters and numbers.",
                },
              ]}
            >
              <Input maxLength={8} />
            </Form.Item>
            <Form.Item
              label="Crown/Pusher Serial"
              name="crown_pusher"
              rules={[
                {
                  pattern: /^[A-Za-z0-9]{5,7}$/,
                  message:
                    "Crown pusher serial numbers must be 5-7 characters long and contain only letters and numbers.",
                },
              ]}
            >
              <Input maxLength={7} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Watch Form" key="watch">
          <Form layout="vertical" onFinish={handleNext} form={form}>
            <Form.Item
              label="Brand"
              name="brand"
              rules={[{ required: true, message: "Please select the brand" }]}
            >
              <Select placeholder="Select a brand">
                {WATCH_BRANDS.map((brand) => (
                  <Select.Option key={brand} value={brand}>
                    {brand}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Model No"
              name="model_no"
              rules={[
                { required: true, message: "Model numbers is required" },
                {
                  pattern: /[A-Za-z0-9-]{10}/,
                  message:
                    "Model number must be 10 alphanumeric characters or hyphens.",
                },
              ]}
            >
              <Input maxLength={10} />
            </Form.Item>
            <Form.Item
              label="Model Name"
              name="model_name"
              rules={[
                { required: true, message: "Model name is required" },
                {
                  pattern: /^[A-Za-z0-9\s-]+$/,
                  message:
                    "Model name must contain only letters, numbers, and hyphens, separated by spaces.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Movement"
              name="movement"
              rules={[
                { required: true, message: "Please select the movement" },
              ]}
            >
              <Select placeholder="Select a movement">
                {WATCH_MOVEMENTS.map((movement) => (
                  <Select.Option key={movement} value={movement}>
                    {movement}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Case Material"
              name="case_material"
              rules={[
                { required: true, message: "Please select the case material" },
              ]}
            >
              <Select placeholder="Select a case material">
                {WATCH_CASE_MATERIALS.map((caseMaterial) => (
                  <Select.Option key={caseMaterial} value={caseMaterial}>
                    {caseMaterial}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Bracelet/Strap Material"
              name="bracelet_strap_material"
              rules={[
                {
                  required: true,
                  message: "Please select the bracelet/strap material",
                },
              ]}
            >
              <Select placeholder="Select a bracelet/strap material">
                {BRACELET_STRAP_MATERIALS.map((braceletStrapMaterial) => (
                  <Select.Option
                    key={braceletStrapMaterial}
                    value={braceletStrapMaterial}
                  >
                    {braceletStrapMaterial}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Year of Production"
              name="yop"
              rules={[
                {
                  required: true,
                  message: "Please select the year of production",
                },
              ]}
            >
              <DatePicker.YearPicker
                format="YYYY"
                placeholder="Select year"
                picker="year"
                disabledDate={(current) =>
                  current &&
                  (current.year() > new Date().getFullYear() ||
                    current.year() < 1969)
                }
              />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Please select your gender" }]}
            >
              <Radio.Group>
                <Radio value="Male">Male</Radio>
                <Radio value="Female">Female</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Cert Form" key="cert">
          <Form layout="vertical" onFinish={handleFinish} form={form}>
            <Form.Item
              label="User Email"
              name="user_email"
              rules={[
                { required: true, message: "Please select the user email" },
              ]}
            >
              {loading ? (
                <Spin size="large" />
              ) : (
                <Select showSearch>
                  {userEmails.map((email) => (
                    <Select.Option key={email} value={email}>
                      {email}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              label="Validated By"
              name="validated_by"
              rules={[
                { required: true, message: "Validated by is required" },
                {
                  pattern: /^[A-Za-z\s-']{2,50}$/,
                  message:
                    "Validated by must be between 2 to 50 characters. Use only letters, spaces, hyphens, and single quotes.",
                },
              ]}
            >
              <Input maxLength={50} />
            </Form.Item>
            <Form.Item
              label="Date of Validation"
              name="date_of_validation"
              rules={[
                {
                  required: true,
                  message: "Please select the date of validation",
                },
              ]}
            >
              <DatePicker
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current.isAfter(new Date(), "day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Issue Date"
              name="issue_date"
              rules={[
                { required: true, message: "Please select the issue date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const dateOfValidation =
                      getFieldValue("date_of_validation");
                    if (
                      !dateOfValidation ||
                      !value ||
                      dateOfValidation.isBefore(value)
                    ) {
                      // Check if the dates are not equal
                      if (
                        !dateOfValidation ||
                        !value ||
                        !dateOfValidation.isSame(value, "day")
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        "Issue Date cannot be the same as Date of Validation"
                      );
                    }
                    return Promise.reject(
                      "Issue Date must come after Date of Validation"
                    );
                  },
                }),
              ]}
            >
              <DatePicker
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current.isAfter(new Date(), "day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Expiry Date"
              name="expiry_date"
              rules={[
                { required: true, message: "Please select the expiry date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const issueDate = getFieldValue("issue_date");
                    const dateOfValidation =
                      getFieldValue("date_of_validation");

                    if (issueDate && value && issueDate.isSame(value, "day")) {
                      return Promise.reject(
                        "Expiry Date cannot be the same as Issue Date"
                      );
                    }

                    if (
                      dateOfValidation &&
                      value &&
                      dateOfValidation.isSame(value, "day")
                    ) {
                      return Promise.reject(
                        "Expiry Date cannot be the same as Date of Validation"
                      );
                    }

                    if (issueDate && value && issueDate.isAfter(value)) {
                      return Promise.reject(
                        "Expiry Date must come after Issue Date"
                      );
                    }

                    if (
                      dateOfValidation &&
                      value &&
                      dateOfValidation.isAfter(value)
                    ) {
                      return Promise.reject(
                        "Expiry Date must come after Date of Validation"
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <DatePicker
                valueFormat="YYYY-MM-DD"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current.isBefore(new Date(), "day")
                }
              />
            </Form.Item>

            <Form.Item
              label="Remarks"
              name="remarks"
              rules={[{ required: true, message: "Please enter the remarks" }]}
            >
              <Input maxLength={255} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handlePrevious}>Previous</Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};
