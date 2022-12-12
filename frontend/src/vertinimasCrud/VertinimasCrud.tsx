import { Routes, Route } from 'react-router-dom'

import VertinimasCreate from './VertinimasCreate';
import VertinimasList from './VertinimasList';
import VertinimasEdit from './VertinimasEdit';


/**
 * CRUD operations on a single kind of entity. This component defines a router for 
 * components of concrete operations. React component.
 * @returns Component HTML.
 */
function VertinimasCrud() {
	//render component html
	let html = 
		<>
		<Routes>
			<Route path="/" element={<VertinimasList/>}/>
			<Route path="/create" element={<VertinimasCreate/>}/>
			<Route path="/edit/:vertinimasId" element={<VertinimasEdit/>}/>
		</Routes>
		</>

	//
	return html;
}

//
export default VertinimasCrud;