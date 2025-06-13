function getVisaStep(visa) {
    if(!visa.optReceipt || visa.visa.optReceipt.status !== 'Approved') return 'optReceipt';
    if (!visa.optEAD || visa.optEAD.status !== 'Approved') return 'optEAD';
    if (!visa.i983 || visa.i983.status !== 'Approved') return 'i983';
    if (!visa.i20 || visa.i20.status !== 'Approved') return 'i20';
    return 'done';
}

module.exports = { getVisaStep };
