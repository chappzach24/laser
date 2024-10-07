import React from "react";
import AdminProductManagement from "./AdminProductManagement";

const AdminPage = () => {
  return (
    <div className="container">
      <h1 className="my-4">Admin Dashboard</h1>
      <AdminProductManagement />
    </div>
  );
};

export default AdminPage;