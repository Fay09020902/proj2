const mongoose = require('mongoose');

const EmployeeProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  firstName: String,
  lastName: String,
  middleName: String,
  preferredName: String,
  profilePictue:{
                type: String,
                default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27iddc2lkX_Zi1p091hfLXpf3vBcbeV9E4g&s'
           },
  address: {
    building: String,
    street: String,
    city: String,
    state: String,
    zip: String
  },

  contact: {
    cellPhone: String,
    workPhone: String
  },

  dob: Date,
  gender: { type: String, enum: ['male', 'female', 'prefer not to say'] },
  ssn: String,

  visa: {
    isCitizenOrResident: Boolean,
    citizenType: { type: String, enum: ['Green Card', 'Citizen'] },
    visaType: { type: String, enum: ['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', 'Other'] },
    otherVisaTitle: String,
    startDate: Date,
    endDate: Date
  },

  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    }
  ],

  reference: {
    firstName: String,
    lastName: String,
    middleName: String,
    phone: String,
    email: String,
    relationship: String
  },

  emergencyContacts: [
    {
      firstName: String,
      lastName: String,
      middleName: String,
      phone: String,
      email: String,
      relationship: String
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
