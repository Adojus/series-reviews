import { Routes, Route } from 'react-router-dom'

import AktoriusCreate from './AktoriusCreate';
import AktoriusList from './AktoriusList';
import AktoriusEdit from './AktoriusEdit';


/**
 * CRUD operations on a single kind of entity. This component defines a router for 
 * components of concrete operations. React component.
 * @returns Component HTML.
 */
function AktoriusCrud() {
	//render component html
	let html = 
		<>
		<Routes>
			<Route path="/" element={<AktoriusList/>}/>
			<Route path="/create" element={<AktoriusCreate/>}/>
			<Route path="/edit/:aktoriusId" element={<AktoriusEdit/>}/>
		</Routes>
		</>

	//
	return html;
}

//
export default AktoriusCrud;