import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployees } from "../context/EmployeeContext";
import { departments, statuses } from "../data/mockEmployees";
import PasswordInput from "../components/PasswordInput";
import { Save, X } from "lucide-react";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addEmployee, updateEmployee, getEmployee } = useEmployees();

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: departments[0],
    status: statuses[0],
    joinDate: new Date().toISOString().split("T")[0],
    image: null,
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isEditMode) {
      const employee = getEmployee(id);

      if (employee) {
        setFormData({
          ...employee,
          image: employee.avatar || null,
        });
      } else {
        navigate("/employees");
      }
    }
  }, [id, isEditMode, getEmployee, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const uploadImage = async (image) => {
    if (!image || typeof image === "string") return "";
    if (!import.meta.env.VITE_IMGBB_API_KEY) return "";

    try {
      const body = new FormData();
      body.append("image", image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        {
          method: "POST",
          body,
        },
      );

      const data = await response.json();

      if (!data.success) {
        return "";
      }

      return data.data.url;
    } catch (error) {
      console.error("Image upload failed", error);
      return "";
    }
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid Gmail address.");
      return;
    }

    try {
      const imageUrl = await uploadImage(formData.image);

      if (!isEditMode) {
        if (!formData.password) {
          alert("A password is required so the employee can sign in.");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match.");
          return;
        }
      }

      const employee = {
        ...formData,
        email: formData.email.trim(),
        avatar: imageUrl || "",
      };

      delete employee.image;
      delete employee.confirmPassword;

      if (isEditMode) {
        const success = await updateEmployee(id, employee);
        if (success) navigate("/employees");
      } else {
        const success = await addEmployee(employee);
        if (success) navigate("/employees");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="employee-form-page animate-fade-in">
      <div className="page-header">
        <div>
          {/* <p className="subtitle">Fill in the details below.</p> */}
        </div>
      </div>

      <div
        className="glass-panel"
        style={{ maxWidth: "800px", padding: "2.5rem" }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@gmail.com"
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Please enter a valid Gmail address."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Role</label>
              <input
                type="text"
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                className="form-select"
                value={formData.department}
                onChange={handleChange}
              >
                {departments.map((dep) => (
                  <option key={dep}>{dep}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input
                type="date"
                name="joinDate"
                className="form-input"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>

            {!isEditMode && (
              <>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <PasswordInput
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Set login password"
                    required={!isEditMode}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <PasswordInput
                    name="confirmPassword"
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required={!isEditMode}
                  />
                </div>
              </>
            )}

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Employee Photo</label>

              <div
                style={{
                  border: "1px dashed var(--color-border)",
                  borderRadius: "12px",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="form-input"
                  onChange={handleChange}
                />

                <p className="subtitle" style={{ fontSize: "0.85rem" }}>
                  Optional profile photo for the employee.
                </p>

                {formData.image && (
                  <img
                    src={
                      typeof formData.image === "string"
                        ? formData.image
                        : URL.createObjectURL(formData.image)
                    }
                    alt="Preview"
                    style={{
                      width: "130px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "2rem",
              paddingTop: "2rem",
              borderTop: "1px solid var(--color-border)",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/employees")}
            >
              <X size={18} />
              Cancel
            </button>

            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              {isEditMode ? "Save Changes" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useEmployees } from '../context/EmployeeContext';
// import { departments, statuses } from '../data/mockEmployees';
// import { Save, X } from 'lucide-react';

// const EmployeeForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addEmployee, updateEmployee, getEmployee } = useEmployees();

//   const isEditMode = !!id;

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     role: '',
//     department: departments[0],
//     status: statuses[0],
//     joinDate: new Date().toISOString().split('T')[0]
//   });

//   useEffect(() => {
//     if (isEditMode) {
//       const employee = getEmployee(id);
//       if (employee) {
//         setFormData(employee);
//       } else {
//         navigate('/employees');
//       }
//     }
//   }, [id, isEditMode, getEmployee, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode) {
//       updateEmployee(id, formData);
//     } else {
//       addEmployee(formData);
//     }
//     navigate('/employees');
//   };

//   return (
//     <div className="employee-form-page animate-fade-in">
//       <div className="page-header">
//         <div>
//           <h1>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
//           <p className="subtitle">Fill in the details below.</p>
//         </div>
//       </div>

//       <div className="glass-panel" style={{ maxWidth: '800px', padding: '2.5rem' }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
//             <div className="form-group">
//               <label className="form-label">Full Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 className="form-input"
//                 placeholder="e.g. Jane Doe"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Email Address</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="form-input"
//                 placeholder="e.g. jane@company.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Job Role</label>
//               <input
//                 type="text"
//                 name="role"
//                 className="form-input"
//                 placeholder="e.g. Senior Developer"
//                 value={formData.role}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">Department</label>
//               <select
//                 name="department"
//                 className="form-select"
//                 value={formData.department}
//                 onChange={handleChange}
//               >
//                 {departments.map(dep => (
//                   <option key={dep} value={dep}>{dep}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Status</label>
//               <select
//                 name="status"
//                 className="form-select"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 {statuses.map(stat => (
//                   <option key={stat} value={stat}>{stat}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-group">
//               <label className="form-label">Join Date</label>
//               <input
//                 type="date"
//                 name="joinDate"
//                 className="form-input"
//                 value={formData.joinDate}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//           </div>

//           <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
//             <button type="button" className="btn btn-secondary" onClick={() => navigate('/employees')}>
//               <X size={18} /> Cancel
//             </button>
//             <button type="submit" className="btn btn-primary">
//               <Save size={18} /> {isEditMode ? 'Save Changes' : 'Create Employee'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EmployeeForm;
