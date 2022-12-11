import { Routes, Route } from 'react-router-dom'

import KategorijaCreate from './KategorijaCreate';
import KategorijaList from './KategorijaList';
import KategorijaEdit from './KategorijaEdit';


/**
 * CRUD operations on a single kind of entity. This component defines a router for 
 * components of concrete operations. React component.
 * @returns Component HTML.
 */
function KategorijaCrud() {
	//render component html
	let html = 
		<>
		<Routes>
			<Route path="/" element={<KategorijaList/>}/>
			<Route path="/create" element={<KategorijaCreate/>}/>
			<Route path="/edit/:kategorijaId" element={<KategorijaEdit/>}/>
		</Routes>
		</>

	//
	return html;
}

//
export default KategorijaCrud;