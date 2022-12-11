
/**
 * Entity for lists.
 */
interface SerialaiForL {
	id: number;
	pavadinimas: string;
	data: string;
	salis: string;
	sezonusk: number;
	epizodusk: number;
	fk_kategorijos_id: number;
}

/**
 * Entity for creating and updating.
 */
class SerialaiForCU {
	id: number = -1;
	pavadinimas: string = "";
	data: string = "";
	salis: string = "";
	sezonusk: number = 0;
	epizodusk: number = 0;
	fk_kategorijos_id: number = 0;
}

//
export type {
	SerialaiForL
}

export {
	SerialaiForCU
}