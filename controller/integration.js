const Integration_ = require('../schema/integration')

class Integration {
	async add({ name, resource, need, code, description }) {
		try {
			const result = await Integration_({
				name: name,
				resource: resource,
				need: need,
				code: code,
				description: description,
			}).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async list() {
		try {
			const result = await Integration_.find()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async listNeed({ need }) {
		try {
			const result = await Integration_.find({
				need: need,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetch({ code }) {
		try {
			const result = await Integration_.findOne({
				code: code,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	//for masfob
	async fetchV2({ product_code }) {
		try {
			const result = await Integration_.find({
				$or: [{ resource: product_code }, { need: product_code }],
			}).lean()

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ code }) {
		try {
			const result = await Integration_.deleteMany({
				code: code,
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async checkEligible({ integration, product_codes }) {
		const { resource, need } = integration

		for (const product of product_codes) {
			if (
				product.product_codes.includes(resource) &&
				product.product_codes.includes(need)
			) {
				return true // Both resource and need are present in this product code
			}
		}

		return false // Neither resource nor need are present in any product code
	}
}
module.exports = Integration
