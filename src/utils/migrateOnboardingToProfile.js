

// Called by HR when they approve an onboarding application
const migrateOnboardingToProfile = async (userId) => {
  const onboarding = await OnboardingApp.findOne({ userId });
  if (!onboarding || onboarding.status !== 'Approved') throw new Error('Invalid migration request');

  const profileExists = await EmployeeProfile.findOne({ userId });
  if (profileExists) throw new Error('Profile already exists');

  const { formData } = onboarding;

  await EmployeeProfile.create({
    userId,
    ...formData.name,
    address: formData.address,
    contact: formData.contact,
    dob: formData.dob,
    gender: formData.gender,
    ssn: formData.ssn,
    visa: formData.visa,
    reference: formData.reference,
    emergencyContacts: formData.emergencyContacts
  });
};

export default migrateOnboardingToProfile;
