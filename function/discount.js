function calculateFixedDiscount(update, amount) {
    console.log('fixed amount');
    const discount_amount = update.discount_value;
    const total_amount = amount - discount_amount;
    return { discount_amount, total_amount };
}

function calculatePercentageDiscount(percentage, amount) {
    console.log('percentage');
    const discount_amount = amount * (percentage / 100);
    const total_amount = amount - discount_amount;
    return { discount_amount, total_amount };
}

module.exports = { calculateFixedDiscount, calculatePercentageDiscount };
