import { Routes, Route } from 'react-router-dom'

import SerialaiCreate from './SerialaiCreate';
import SerialaiList from './SerialaiList';
import SerialaiEdit from './SerialaiEdit';


/**
 * CRUD operations on a single kind of entity. This component defines a router for 
 * components of concrete operations. React component.
 * @returns Component HTML.
 */
function SerialaiCrud() {
	//render component html
	let html = 
		<>
		<Routes>
			<Route path="/" element={<SerialaiList/>}/>
			<Route path="/create" element={<SerialaiCreate/>}/>
			<Route path="/edit/:serialasId" element={<SerialaiEdit/>}/>
		</Routes>
		</>

	//
	return html;
}

//
export default SerialaiCrud;