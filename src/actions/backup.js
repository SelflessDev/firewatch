module.exports = function(db, path) {
	let initialPath = path ? path : db
	return scavengeData(initialPath)
}

function scavengeData(path) {
	return getCollectionsFromDocument(path).then(collections => {
		let obj = {}

		return collections.length == 0
			? obj
			: Promise.all(collections.map(collection =>
				getCollectionData(collection.ref).then(data => {
					obj[collection.name] = data.map(doc => doc.data)
				})
			)).then(() => obj)
	})
}

function getCollectionsFromDocument(doc) {
	return doc.getCollections().then(result => {
		let collections = []

		result.map(item => collections.push({
			name: item.id,
			ref: item
		}))

		return collections
	})
}

function getCollectionData(collection) {
	return collection.get().then(result => {
		let data = []

		result.forEach(item => data.push({
			ref: item,
			data: item.data()
		}))

		return data
	})
}