const crypto = require('crypto')

// function attestation(req, res, next) {
// 	try {
// 		const receivedSignature = req.headers['x-webhook-signature']
// 		if (!receivedSignature) {
// 			return res.status(400).json({ error: 'Signature missing in headers' })
// 		}

// 		const calculatedSignature = sign()
// 		if (receivedSignature !== calculatedSignature) {
// 			return res.status(401).json({ error: 'Invalid signature' })
// 		}

// 		// Signature is valid, proceed with the request
// 		next()
// 	} catch (error) {
// 		throw error
// 	}
// }

// function sign() {
// 	const hmac = crypto.createHmac('sha256', 'masfob234567dvskjdhs7d587n')
// 	return hmac.digest('hex')
// }

function sign(data) {
    const secret = process.env.SIGN_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    return hmac.digest('hex');
}

function attestation(req, res, next) {
    try {
        const signature = req.headers['x-webhook-signature'];

        if (!signature) {
            console.error('NO SIGNATURE');
            return res.status(400).json({ error: 'No signature provided' });
        }
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        // console.log(req.body);
        // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
        const payload = JSON.stringify(req.body);
        const generatedSignature = sign(payload);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        // console.log('Generated Signature:', generatedSignature); 
        // console.log('Received Signature:', signature);
        // console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        if (generatedSignature !== signature) {
            console.error('INVALID SIGNATURE');
            return res.status(403).json({ error: 'Invalid signature' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


function razorAttestation(req, res, next) {
	try {
		const headers = req.headers
		const razorSignature = headers['x-razorpay-signature']
		if (!razorSignature) {
			return res.status(400).json({ error: 'Signature missing in headers' })
			console.error('NO SIGNATURE')
		}
		const payload = JSON.stringify(req.body)

		const hmac = crypto.createHmac('sha256', 'masfob234567dvskjdhs7d587n')
		hmac.update(payload, 'utf-8')
		const encodedPayload = hmac.digest('hex')

		if (encodedPayload !== razorSignature) {
			console.error('INVALID SIGNATURE')
			return res.status(400).json({ error: 'Signature invalid' })
		}

		next()
	} catch (error) {
		console.error(error)
		throw error
	}
}

module.exports = { sign, attestation, razorAttestation }
