import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Select, message, Spin } from "antd";
import { transferOwnership } from "../../api/certs";

// TransferOwnershipModal component for transferring certificate ownership
export const TransferOwnershipModal = ({
  visible,
  onCancel,
  emails,
  user_email,
  cert_id,
  setRefetchCert,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Clear the form fields when the component mounts and the modal becomes visible
  useEffect(() => {
    form.setFieldsValue({
      email: "",
    });
  }, [form, onCancel]);

  // Handle form submission when the "Submit" button is clicked
  const handleFinish = async (values) => {
    try {
      setLoading(true);
      // Request to transfer certificate ownership
      const response = await transferOwnership({
        cert_id,
        current_email: user_email,
        next_email: values.email,
      });

      if (response.success) {
        message.success("Certificate ownership transferred successfully");
        // Refresh the certificate list
        setRefetchCert(true);
        onCancel(); // Close the modal
      } else {
        message.error("Certificate ownership failed to transfer");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      forceRender
      title="Transfer Ownership Form"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin size="large" spinning={loading}>
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            label="User Email"
            name="email"
            rules={[
              { required: true, message: "Please select the user email" },
            ]}
          >
            {emails && (
              <Select showSearch>
                {emails.map((email) => (
                  <Select.Option key={email} value={email}>
                    {email}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
