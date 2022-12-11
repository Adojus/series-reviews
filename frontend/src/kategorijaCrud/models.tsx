
/**
 * Entity for lists.
 */
interface KategorijaForL {
	id: number;
	pavadinimas: string;
}

/**
 * Entity for creating and updating.
 */
class KategorijaForCU {
	id: number = -1;
	pavadinimas: string = "";
}

//
export type {
	KategorijaForL
}

export {
	KategorijaForCU
}