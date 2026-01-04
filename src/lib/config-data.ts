export const registrationOptions = {
  roles: [
    { value: 'student', label: 'Student' },
    { value: 'professional', label: 'Professional' },
  ],
  govIdTypes: [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'national_id', label: 'National ID' },
  ],
  colleges: [
    { id: 'col1', name: 'Stanford University', type: 'University', registrations: 125 },
    { id: 'col2', name: 'MIT', type: 'University', registrations: 98 },
    { id: 'col3', name: 'Harvard University', type: 'University', registrations: 110 },
    { id: 'col4', name: 'UC Berkeley', type: 'University', registrations: 210 },
    { id: 'col5', name: 'Acme Corporation', type: 'Organization', registrations: 45 },
    { id: 'col6', name: 'Yale University', type: 'University', registrations: 80 },
    { id: 'col7', name: 'Princeton University', type: 'University', registrations: 75 },
    { id: 'col8', name: 'Innovate Inc.', type: 'Organization', registrations: 32 },
    { id: 'col9', name: 'Columbia University', type: 'University', registrations: 150 },
    { id: 'col10', name: 'Tech Solutions LLC', type: 'Organization', registrations: 60 },
  ]
};
