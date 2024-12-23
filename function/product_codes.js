function checkSubscription(check_subscription, code) {
	let isValid = false
	let endDate = null

	for (const item of check_subscription) {
		if (item.product_codes.includes(code)) {
			isValid = true
			// If endDate is null or the new date is later, update the endDate
			if (!endDate || new Date(item.end_date) > new Date(endDate)) {
				endDate = item.end_date
			}
		}
	}

	return { isValid, endDate }
}

module.exports = checkSubscription
