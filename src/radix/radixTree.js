class RadixNode {
	constructor(edgeLabel, isWord = false) {
		this.edgeLabel = edgeLabel;
		this.children = {};

		this.isWord = isWord;
	}
}

export default class RadixTree {
	constructor() {
		this.root = new RadixNode('');
	}

	addWord(word) {
		word = word.toLowerCase();

		let currentNode = this.root;

		// iterate over the characters of the given word
		for (let i = 0; i < word.length; i++) {
			const currentCharacter = word[i];

			// check to see if there is a child of the currentNode with an edge label starting with the currentCharacter
			if (currentCharacter in currentNode.children) {
				const edgeLabel = currentNode.children[currentCharacter].edgeLabel;

				// get the common prefix of this child's edge label and what's left of the word
				const commonPrefix = getCommonPrefix(edgeLabel, word.substr(i));

				// if the edge label and what's left of the word are the same
				if (edgeLabel === word.substr(i)) {
					// update this child's data with the given data
					currentNode.children[currentCharacter].isWord = true;

					return;
				}

				// if the edge label contains the entirety of what's left of the word plus some extra
				if (commonPrefix.length < edgeLabel.length && commonPrefix.length === word.substr(i).length) {
					// insert a new node (that's the new word) between the current node and the child, splitting up the edge label
					const newNode = new RadixNode(word.substr(i), true);

					// move the child so it's a child of the new node instead of the current node
					newNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

					// make the edge label between the new node and it's child what's left of the edge label
					newNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

					// make the new node a child of current node
					currentNode.children[currentCharacter] = newNode;

					return;
				}

				// if the edge label and what's left of the word share a common prefix, but differ at some point
				if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substr(i).length) {
					// insert a new inbetween node between current node and it's child, that will have children for the old child and a new node for the given word.
					const inbetweenNode = new RadixNode(commonPrefix);

					// move the child so it's a child of the inbetween node instead of the current node
					inbetweenNode.children[edgeLabel[commonPrefix.length]] = currentNode.children[currentCharacter]

					// make the edge label between the inbetween node and the child what's left of the edge label
					inbetweenNode.children[edgeLabel[commonPrefix.length]].edgeLabel = edgeLabel.substr(commonPrefix.length);

					// replace the child with the new inbetween node as a child of the current node
					currentNode.children[currentCharacter] = inbetweenNode;

					// add what's left of the word as another child for the inbetween node
					inbetweenNode.children[word.substr(i)[commonPrefix.length]] = new RadixNode(word.substr(i + commonPrefix.length), true);

					return;
				}

				// the last option is what's left of the word contains the entirety of the edge label plus some extra
				// follow the edge, and take off all the characters the edge has
				i += edgeLabel.length - 1;
				currentNode = currentNode.children[currentCharacter];
			} else {
				const newNode = new RadixNode(word.substr(i), true);
				currentNode.children[currentCharacter] = newNode;

				return;
			}
		}
	}

	async getWords(prefix) {
		prefix = prefix.toLowerCase();

		let word = '';
		let currentNode = this.root;

		// iterate over the characters of the given prefix, following the Radix Tree
		// to find which node it ends at
		for (let i = 0; i < prefix.length; i++) {
			const character = prefix[i];

			if (character in currentNode.children) {
				const edgeLabel = currentNode.children[character].edgeLabel;
				const commonPrefix = getCommonPrefix(edgeLabel, prefix.substr(i));

				// if the commonPrefix doesn't match the edge label or what's left of the given prefix
				// than what's left of the given prefix differs from the edgeLabel, and there aren't
				// any words in the RadixTree that begin with it.
				if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== prefix.substr(i).length) {
					return [];
				}

				// add the selected child's characters to word
				word = word.concat(currentNode.children[character].edgeLabel);
				// increment i, taking off the edge label's characters
				i += currentNode.children[character].edgeLabel.length - 1;
				// update the current node to the selected child
				currentNode = currentNode.children[character];
			} else {
				// if there isn't an edge label that begins with the next prefix character
				// there are no words in the Radix tree that begin with the given prefix
				return [];
			}
		}

		// DFS starting at current node to get all possible words with the given prefix
		let words = [];
		async function dfs(startingNode, word) {
			// if we are currently visitng a node that's a word
			if (startingNode.isWord) {
				// append the given prefix to the running array of words
				words.push(word);
			}

			// if there are no child nodes return
			if (Object.keys(startingNode.children).length === 0) {
				return;
			}

			// for each child of the given child node
			for (const character of Object.keys(startingNode.children)) {
				// recursively call dfs on each child, after concating that child's edge label with the given prefix
				await dfs(startingNode.children[character], word.concat(startingNode.children[character].edgeLabel));
			}
		}

		await dfs(currentNode, word);

		return words;
	}
}

/*
 * getCommonPrefix calculates the largest common prefix of two given strings
 */
function getCommonPrefix(a, b) {
	let commonPrefix = '';
	for (let i = 0; i < Math.min(a.length, b.length); i++) {
		if (a[i] !== b[i]) {
			return commonPrefix;
		}

		commonPrefix += a[i];
	}

	return commonPrefix;
}