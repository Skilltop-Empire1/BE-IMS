const validatePhoneNumber = (phoneNumber) => {
    const localPattern = /^0[7-9][0-1]\d{8}$/;
    const internationalPattern = /^234\d{10}$/;
    return localPattern.test(phoneNumber) || internationalPattern.test(phoneNumber);
};

module.exports = { validatePhoneNumber };