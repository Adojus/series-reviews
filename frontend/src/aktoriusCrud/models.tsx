
/**
 * Entity for lists.
 */
interface AktoriusForL {
	id: number;
	vardas: string;
    pavarde: string;
    gimimo_data: string;
    lytis: string;
    salis: string;
}

/**
 * Entity for creating and updating.
 */
class AktoriusForCU {
	id: number = -1;
	vardas: string ='';
    pavarde: string ='';
    gimimo_data: string ='';
    lytis: string ='';
    salis: string ='';
}

//
export type {
	AktoriusForL
}

export {
	AktoriusForCU
}