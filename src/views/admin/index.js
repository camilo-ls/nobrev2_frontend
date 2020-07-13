import React from 'react';

// Componentes custom:
import HeaderAdmin from '../../components/header_admin'
import AdminFormTable from '../../components/admin_form_table'

function Admin() {
  return (
    <React.Fragment>
      <HeaderAdmin />
      <AdminFormTable />
    </React.Fragment>
  );
}

export default Admin;
