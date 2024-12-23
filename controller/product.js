const mongoose = require('mongoose')
const Product_ = require('../schema/product')
class product {
	async add({ name, code, description, image, url }) {
		try {
			const result = new Product_({
				name,
				code,
				description,
				image,
				url,
			}).save()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async updateLogo({ code, image }) {
		try {
			const result = await Product_.findOneAndUpdate(
				{
					code,
				},
				{ $set: { image } },
				{ new: true }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async list() {
		try {
			const result = await Product_.find()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	//masfob
	async listV2() {
		try {
			const result = await Product_.find(
				{},
				{ name: 1, version: 1, image: 1, code: 1 ,description:1,url:1}
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async fetch({ product_code }) {
		try {
			const result = await Product_.find({ code: product_code }).lean()
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async fetchv2({ product_code }) {
		try {
			const result = await Product_.find({ code: product_code }).lean()
			return result[0]
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async update({ code, description, name, url }) {
		console.log("ccc");
		
		try {
			const result = await Product_.updateOne(
				{ code: code },
				{
					$set: { description: description, name: name, url: url },
				},
				{ new: true }
			)
			console.log(result);
			
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async remove({ code }) {
		try {
			const result = await Product_.deleteMany(
				{ code },

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async addScreenshot({ product_code, url }) {
		try {
			const result = await Product_.findOneAndUpdate(
				{ code: product_code },
				{ $push: { screen_shots: url } },
				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async removeScreenshot({ product_code, url }) {
		try {
			//           const productId = new mongoose.Types.ObjectId(product_id);
			//           console.log(productId);
			//           var _id =productId.toString();
			// console.log("_id",_id);

			const result = await Product_.updateOne(
				{ code: product_code },
				{
					$pull: {
						screen_shots: url, //"hareeshjr"
					},
				}
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async addFeature({ product_code, features }) {
		try {
			const result = await Product_.findOneAndUpdate(
				{ code: product_code },
				{ $push: { features: features } },

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async removeFeature({ product_code, features }) {
		try {
			const result = await Product_.updateOne(
				{ code: product_code },
				{
					$pull: {
						features: features, //"hareeshjr"
					},
				}
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async updateVersion({ product_code, version, whats_new, upcoming }) {
		try {
			const result = await Product_.findOneAndUpdate(
				{ code: product_code },
				{
					$set: { version: version, whats_new: whats_new, upcoming: upcoming },
				},

				{ new: true }
			)

			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}

	async addIntegration({
		product_code,
		name,
		logo,
		description,
		target_product_code,
	}) {
		try {
			const result = await Product_.updateOne(
				{
					code: product_code,
				},

				{
					$push: {
						integration: {
							code: 'indicvbnmg',
							name: name,
							description: description,
							logo: logo,
							target_product_code: target_product_code,
						},
					},
				},
				{ new: true }
			)
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
	async listIntegration() {
		try {
			const result = await Product_.find({
				code: 'INDERACT',
			})
			return result
		} catch (error) {
			console.error(error)
			throw error
		}
	}
}
module.exports = product
