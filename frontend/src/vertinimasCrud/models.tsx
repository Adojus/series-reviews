
/**
 * Entity for lists.
 */
interface VertinimasForL {
	id: number;
	komentaras: string;
	data: string;
	ivertinimas: number;
	fk_naudotojo_id: number;
	fk_serialo_id: number;
}

/**
 * Entity for creating and updating.
 */
class VertinimasForCU {
	id: number = -1;
	komentaras: string = "";
	data: string = "";
	ivertinimas: number = 0;
	fk_naudotojo_id: number = 0;
	fk_serialo_id: number = 0;
}

//
export type {
	VertinimasForL
}

export {
	VertinimasForCU
}