// This file is now deprecated for roles and govIdTypes, 
// as they are fetched from the database.
// The colleges data can remain here for now.

export const registrationOptions = {
  roles: [
    { value: 'student', label: 'Student' },
    { value: 'professional', label: 'Professional' },
    { value: 'examiner', label: 'Examiner' },
  ],
  govIdTypes: [
    { value: 'passport', label: 'Passport' },
    { value: 'drivers_license', label: "Driver's License" },
    { value: 'national_id', label: 'National ID' },
  ],
  colleges: [
  ]
};
