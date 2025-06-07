import { IVoteItems } from "../common/voteTypes";

/**
 * 투표 아이템 변화 여부 체크 - Object의 배열이기 떄문에 별도 체크 필요
 * @param a IVoteItems[]
 * @param b IVoteItems[]
 * @returns Boolean
 */
export function areItemsEqualUnordered(
	a: IVoteItems[],
	b: IVoteItems[]
): boolean {
	if (a.length !== b.length) return false;

	const sortFn = (item: IVoteItems) => `${item.itemName}-${item.score}`;
	const sortedA = [...a].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));
	const sortedB = [...b].sort((x, y) => sortFn(x).localeCompare(sortFn(y)));

	return sortedA.every((item, index) => {
		return (
			item.itemName === sortedB[index].itemName &&
			item.score === sortedB[index].score
		);
	});
}
