/* eslint-disable no-undef */

/**
 * Return simple commit message without `docs(release):` prefix
 */
const getAddMessage = ({summary}) => {
	return summary
}

module.exports = {getAddMessage}
